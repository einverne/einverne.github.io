---
layout: post
title: "Gson 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [java, gson, json, google]
last_updated: 
---

Gson 是 Google 发布的一个用于序列化和反序列化 json 的工具库，可以非常轻松的实现 json 到 java Object 的转变，也同样非常简单的可以将一个 Java 实例序列化为 json。

## 基本使用

Gson 最基本的使用方法，无非就是 `toJson()` 和 `fromJson()` 两个函数，对于简单类，可以使用如下方式：

String json = gson.toJson(target); // serializes target to Json
MyType target2 = gson.fromJson(json, MyType.class); // deserializes json into target2

如果类中含有数组，会需要用到 `toJson(Object, Type)` 和 `fromJson(String, Type)` 这两个方法：

    Type listType = new TypeToken<List<String>>() {}.getType();
    List<String> target = new LinkedList<String>();
    target.add("blah");
    
    Gson gson = new Gson();
    String json = gson.toJson(target, listType);
    List<String> target2 = gson.fromJson(json, listType);


## 属性重命名

Gson 默认情况下会使用 POJO 一致的属性名去解析和生成 json 字串，但是如果想要解析和生成的时候重命名字段，可以使用 `@SerializedName` 来重命名。

比如 json 中的字段叫做 `email_address`，而在 Java 类中，可以改为 emailAddress。这样，gson 在生成时会自动将 emailAddress 属性，改为 `email_address`

    @SerializedName("email_address")
    public String emailAddress;

如果 `emailAddress` 在 json 中还有其他的方式，也可以使用：

    @SerializedName(value = "emailAddress", alternate = {"email", "email_address"})
    public String emailAddress;


## 重新格式化序列化和反序列化的内容

在将 json 转化为 Java Object 的时候，可以自定义 Deserializer ，格式化其中的某一些字段，比如下面内容，将 `dateOfBirth` 修改了格式。

    public class ActorGsonDeserializer implements JsonDeserializer<ActorGson> {
        private SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy hh:mm:ss a");

        @Override
        public ActorGson deserialize(JsonElement json, Type type, JsonDeserializationContext jsonDeserializationContext)
                throws JsonParseException {
            JsonObject jsonObject = json.getAsJsonObject();

            JsonElement jsonImdbId = jsonObject.get("imdbId");
            JsonElement jsonDateOfBirth = jsonObject.get("dateOfBirth");
            JsonArray jsonFilmography = jsonObject.getAsJsonArray("filmography");

            ArrayList<String> filmList = new ArrayList<>();
            if (jsonFilmography != null) {
                for (int i = 0; i < jsonFilmography.size(); i++) {
                    filmList.add(jsonFilmography.get(i).getAsString());
                }
            }

            ActorGson actorGson = null;
            try {
                actorGson = new ActorGson(jsonImdbId.getAsString(), sdf.parse(jsonDateOfBirth.getAsString()), filmList);
            } catch (ParseException e) {
                e.printStackTrace();
            }
            return actorGson;
        }
    }



    Gson gson = new GsonBuilder()
            .registerTypeAdapter(ActorGson.class, new ActorGsonDeserializer())
            .create();


## 忽略某些字段

### 使用 transient 关键字

在 java 序列化是，一旦变量被 `transient` 修饰，变量将不再是持久化的一部分，变量内容在序列化后无法获得访问。同样如果在使用 Gson 序列化 json 的时候，添加关键字 transient 同样，Gson 也会[忽略](https://sites.google.com/site/gson/gson-user-guide#TOC-Finer-Points-with-Objects)该字段:

    private transient int id;

需要注意的是，如果一个 field 是 `static` 静态变量，gson 也会排除。Gson 在创建的时候可以使用 `excludeFieldsWithModifiers` 来指定排除的 field：

    Gson gson = new GsonBuilder()
        .excludeFieldsWithModifiers(Modifier.STATIC, Modifier.TRANSIENT, Modifier.VOLATILE)
        .create();

### 使用 @Expose 注解保留关心的字段

最早不知道 `transient` 关键字的时候，看文档中只写了 `@Expose` 注解，但其实效果是一样的。使用 `@Expose` 注解来保留关心的字段，其他不需要的字段可以不注解，同样能够达到效果。

    private int id; // 忽略id
    @Expose private String name;    //保留name

如果使用 `@Expose` 注解，那么则需要使用 `GsonBuilder()`

    Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

### 自定义 ExclusionStrategy 规则

如果有更加复杂的排除规则，比如某一批Field，或者指定的 Class 不需要 serialize ，可以使用 `ExclusionStrategy` 来自定规则。

    import com.google.gson.ExclusionStrategy;
    import com.google.gson.FieldAttributes;
    import com.jutils.gson.entity.Car;
    import com.jutils.gson.entity.PersonStrategy;

    /**
     * ExclusionStrategy
     *
     * A strategy (or policy) definition that is used to decide whether or not a field or top-level class should be serialized or deserialized as part of the JSON output/input.
     */
    public class ExcluStrategy implements ExclusionStrategy {
        @Override
        public boolean shouldSkipField(FieldAttributes f) {
            // ignore id field
            if (f.getDeclaringClass() == PersonStrategy.class && f.getName().equals("id")) {
                return true;
            }
            return false;
        }

        @Override
        public boolean shouldSkipClass(Class<?> aClass) {
            if (aClass == Car.class) {
                return true;
            }
            return false;
        }
    }

比如说上面这个，就忽略 PersonStrategy 类中的 Field "id"，还有 Car 类。如果使用这种方式，那么需要在构造 gson 时:

    Gson gson = new GsonBuilder().setExclusionStrategies(new ExcluStrategy()).create();

### 实现自定义注解

如果熟悉了这个 `ExclusionStrategy` 就可以书写自己的注解。

注解

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface Exclude {
    }

AnnotationExclusionStrategy 类

    public class AnnotationExclusionStrategy implements ExclusionStrategy {
        @Override
        public boolean shouldSkipField(FieldAttributes fieldAttributes) {
            return fieldAttributes.getAnnotation(Exclude.class) != null;
        }

        @Override
        public boolean shouldSkipClass(Class<?> aClass) {
            return false;
        }
    }

测试方法

    @Test
    public void annotationTest() {
        PersonAnnotation annotation = new PersonAnnotation(1L, "name", 10);
        Gson gson = new GsonBuilder().setExclusionStrategies(new AnnotationExclusionStrategy()).create();
        String s = gson.toJson(annotation);
        System.out.println(s);
    }


## reference

- <https://stackoverflow.com/q/4802887/1820217>
- <https://github.com/google/gson/blob/master/UserGuide.md>
- <http://www.javadoc.io/doc/com.google.code.gson/gson/2.8.2>
