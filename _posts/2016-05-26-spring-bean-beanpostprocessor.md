---
layout: post
title: "Spring BeanPostProcessor 使用"
aliases: "Spring BeanPostProcessor 使用"
tagline: ""
description: ""
category: 学习笔记
tags: [spring, java, bean, spring-bean, spring-bean-lifecycle, ]
last_updated:
---

`BeanPostProcessor` 接口允许在 Spring Bean Factory 返回 Bean instance 时修改 Bean 的创建过程。这是影响 Bean 生命周期的一部分。

接口有两个方法：

```
public interface BeanPostProcessor {
    @Nullable
    default Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
            return bean;
        }
    @Nullable
    default Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }
}
```

## Bean life cycle
要了解 `BeanPostProcessor` 接口就不得不提及 Bean 的生命周期。

### Life cycle callbacks
Two groups:

- Post-initialization
- Pre-destruction

Life cycle:

- Instantiation
- Populate Properties
- BeanNameAware's setBeanName()
- BeanFactoryAware's setBeanFactory()
- Pre-initialization BeanPostProcessors
- InitializingBeans' afterPropertiesSet()
- Call custom init-method
- Post-initialization BeanPostProcessors
- Bean is ready to use
![[202101151422-how to become smarter]]
Container is shutdown:

- DisposableBean's destroy()
- Call custom destroy-method

### Callback
Spring 提供了这些方法可以在生命周期过程中回调。

- InitializingBean 和 DisposableBean
- Spring 提供的一系列 `*Aware` 接口
- 配置文件中自定义 `init()` 和 `distroy()` 方法
- 注解 `@PostConstruct` 和 `@PreDestroy`

### InitializingBean 和 DisposableBean
大致这样：

	import org.springframework.beans.factory.DisposableBean;
	import org.springframework.beans.factory.InitializingBean;

	public class DemoBean implements InitializingBean, DisposableBean
	{
		//Other bean attributes and methods

		@Override
		public void afterPropertiesSet() throws Exception
		{
			//Bean initialization code
		}

		@Override
		public void destroy() throws Exception
		{
			//Bean destruction code
		}
	}

### Aware interfaces

- ApplicationContextAware 任何 bean 想要 ApplicationContext 启动时被通知可以实现该接口
- ApplicationEventPublisherAware
- BeanClassLoaderAware
- BeanFactoryAware
- BeanNameAware
- BootstrapContextAware
- LoadTimeWeaverAware
- MessageSourceAware
- NotificationPublisherAware
- PortletConfigAware
- PortletContextAware
- ResourceLoaderAware
- ServletConfigAware
- ServletContextAware

### Custom init() and destroy() methods
定义单个 Bean:

	<beans>
	 <bean id="demoBean" class="info.einverne.deme.DemoBean"
						init-method="customInit"
						destroy-method="customDestroy"></bean>
	</beans>

全局定义：

	<beans default-init-method="customInit" default-destroy-method="customDestroy">
	    <bean id="demoBean" class="info.einverne.demo.DemoBean"></bean>
	</beans>

### @PostConstruct and @PreDestroy

- @PostConstruct annotated method will be invoked after the bean has been constructed using default constructor and just before it’s instance is returned to requesting object.
- @PreDestroy annotated method is called just before the bean is about be destroyed inside bean container.

## BeanPostProcessor


	@Slf4j
	@Component
	public class CustomBeanPostProcessor implements BeanPostProcessor {


	  @Override
	  public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
		log.info("BeanPostProcessor postProcessBeforeInitialization for:" + beanName);
		return bean;
	  }

	  @Override
	  public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
		log.info("BeanPostProcessor postProcessAfterInitialization for:gg" + beanName);
		return bean;
	  }
	}
