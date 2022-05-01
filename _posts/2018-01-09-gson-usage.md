---
layout: post
title: "Gson 使用笔记"
tagline: ""
description: ""
category: 学习笔记
tags: [java, gson, json, google]
last_updated:
---

Gson 是 Google 发布的一个用于序列化和反序列化 json 的工具库，可以非常轻松的实现 json 到 java Object 的转变，也同样非常简单的可以将一个 Java 实例序列化为 json。

Gson 包中主要的类有 Gson, GsonBuilder, JsonParser 等等。

## 基本类介绍

### JsonParser
JsonParser 是将 json 串解析成 JsonElement 的工具类。JsonParser 有三个 `parse()` 方法，分别接受不同类型的参数：

- String
- Reader
- JsonReader

内部实现时使用 JsonReader 类进行解析。


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

在 java 序列化是，一旦变量被 `transient` 修饰，变量将不再是持久化的一部分，变量内容在序列化后无法获得访问。同样如果在使用 Gson 序列化 json 的时候，添加关键字 transient 同样，Gson 也会[忽略](https://sites.google.com/site/gson/gson-user-guide#TOC-Finer-Points-with-Objects) 该字段：

    private transient int id;

需要注意的是，如果一个 field 是 `static` 静态变量，gson 也会排除。Gson 在创建的时候可以使用 `excludeFieldsWithModifiers` 来指定排除的 field：

    Gson gson = new GsonBuilder()
        .excludeFieldsWithModifiers(Modifier.STATIC, Modifier.TRANSIENT, Modifier.VOLATILE)
        .create();

### 使用 @Expose 注解保留关心的字段

最早不知道 `transient` 关键字的时候，看文档中只写了 `@Expose` 注解，但其实效果是一样的。使用 `@Expose` 注解来保留关心的字段，其他不需要的字段可以不注解，同样能够达到效果。

    private int id; // 忽略 id
    @Expose private String name;    // 保留 name

如果使用 `@Expose` 注解，那么则需要使用 `GsonBuilder()`

    Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();

### 自定义 ExclusionStrategy 规则

如果有更加复杂的排除规则，比如某一批 Field，或者指定的 Class 不需要 serialize ，可以使用 `ExclusionStrategy` 来自定规则。

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

比如说上面这个，就忽略 PersonStrategy 类中的 Field "id"，还有 Car 类。如果使用这种方式，那么需要在构造 gson 时：

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

## 将 JSON 中小写下划线转成驼峰
使用 GsonBuilder 来构造 Gson，然后传入 FieldNamingPolicy，这个方法接受很多参数，不仅可以做到将小写下划线转驼峰，还有其他很多功能。

    Gson gson = new GsonBuilder()
    .setFieldNamingPolicy(FieldNamingPolicy.LOWER_CASE_WITH_UNDERSCORES)
    .create();

FieldNamingPolicy 还有这些

	IDENTITY
	Using this naming policy with Gson will ensure that the field name is unchanged.
	LOWER_CASE_WITH_DASHES
	Using this naming policy with Gson will modify the Java Field name from its camel cased form to a lower case field name where each word is separated by a dash (-).
	LOWER_CASE_WITH_UNDERSCORES
	Using this naming policy with Gson will modify the Java Field name from its camel cased form to a lower case field name where each word is separated by an underscore (_).
	UPPER_CAMEL_CASE
	Using this naming policy with Gson will ensure that the first "letter" of the Java field name is capitalized when serialized to its JSON form.
	UPPER_CAMEL_CASE_WITH_SPACES
	Using this naming policy with Gson will ensure that the first "letter" of the Java field name is capitalized when serialized to its JSON form and the words will be separated by a space.


## 反序列化时默认值
某一些情况下在反序列化 json 到 Object 时，在某些字段 JSON 中缺失时，想要给 Object 提供一个默认值，但是 Gson 在处理原始类型时，比如 int 字段，如果缺失会自动赋值为 0，某些情况下是不符合预期的。Gson 在设定默认值时需要，在 Object 构造函数中初始化该字段，并且实现 `InstanceCreator` 接口。

    public class RawDataInstanceCreator implements InstanceCreator<RawData> {

      @Override
      public RawData createInstance(Type type) {
        return new RawData();
      }
    }

构造时传入：

    Gson gson = new GsonBuilder()
        .registerTypeAdapter(RawData.class, new RawDataInstanceCreator())
        .create();

## Gson 反序列化时类型不匹配
举一个比较通俗的例子就是，当一条 JSON 数据返回时，字段值是一个 Double，但是返回的时候是放在字符串中返回的。这个时候就需要用到 TypeAdapter。


	class DoubleTypeAdapter extends TypeAdapter<Number> {
		@Override
		public void write(JsonWriter jsonWriter, Number number) throws IOException {
		  jsonWriter.value(number);
		}

		@Override
		public Number read(JsonReader jsonReader) throws IOException {
		  if (jsonReader.peek() == JsonToken.NULL) {
			jsonReader.nextNull();
			return 0D;
		  }
		  String result = jsonReader.nextString();
		  if ("".equals(result)) {
			return 0D;
		  }
		  return Double.parseDouble(result);
		}
	}

然后创建 Gson 时：

```
    Gson gson = new GsonBuilder()
        .registerTypeAdapter(Double.class, new DoubleTypeAdapter()).create();
```


## reference

- <https://stackoverflow.com/q/4802887/1820217>
- <https://github.com/google/gson/blob/master/UserGuide.md>
- <http://www.javadoc.io/doc/com.google.code.gson/gson/2.8.2>
