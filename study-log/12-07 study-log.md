# JavaScript & TypeScript 강의

- **Background**
    
    ## 고차 함수(High Order Function) & 일급 함수(First Class Function)
    
    ---
    
    작성중...
    
    ## 객체(Object: 속성과 메소드)
    
    ---
    
    - Getter & Setter
    
    함수의 리턴값을 외부에서 속성처럼 접근할 수 있도록 해주는 키워드.
    
    함수 앞에 `get` , `set` 지시어를 통해 사용한다.
    
    - JS의 객체(Object) 읽기 속성 지정(readonly)
    
    TS의 경우에는 객체의 구성정보를 서술하는 것이 편리하다.
    
    읽기만 가능하게 하고 싶은 속성은 readonly로 지정하고
    
    속성 이름 뒤에 ? 를 적어주면 해당 속성을 삭제해도 문제가 생기지 않는다.
    
    같은 기능을 JS에서 구현하고자 한다면, 최상위 객체인 Object의 메소드인 `Object.create()` 함수를 이용한다.
    
    첫번째 인자는 상속받을 객체, 두번째 인자는 구성정보가 된다.
    
    ```tsx
    const myObj = Object.create(null, {
    	name: {
    		value: 'SleepyCloud',
    		writable: false,
    		configurable: true
    	}
    });
    ```
    
    위와 같이 사용하면 myObj 객체는 name 속성에 'SleepyCloud'가 할당되어 있고 속성 값이 수정 가능하며 속성 자체를 제거 가능한 객체가 된다.
    
- **강의 내용 정리**
    
    ## 함수(Function)
    
    ---
    
    - 익명 함수
    - 함수 식(assign to var)
    - 즉시 실행 함수
    - 가변인자(Rest parameters)
    - 호출 방식
    - 화살표 함수(Arrow function)
    - 생성기 함수(Generator)
    - 비동기 함수(async, await)
    
    JavaScript 함수의 문법에는 독특한 것들이 있다.
    
    호출하는 방식도 3가지(원형, call, apply)이고, 가변인자를 처리해주는 방식(rest args)을 가지고 있다.
    
    ## 프로미스(Promise)
    
    ---
    
    비동기(asynchronous) 방식의 코드를 작성하기 위해 사용한다.
    
    ## 컨텍스트(context)
    
    - ***실행 컨텍스트(Execution context)***
    call(), apply()를 통해 context를 특정할 수 있는 방법이 존재한다.
    ***bind()***를  통해서도 마찬가지로 context, 즉 this를 고정시킬 수 있다.
    - ***어휘 컨텍스트(Lexical context)***
    **Arrow function**으로 메소드 생성을 하는 경우,
    this가 메소드 정의할 때 시점의 this로 고정이 된다.
    
    ## 라이프 사이클(Life cycle) & 스코프(Scope)
    
    ---
    
    - 전역 스코프(global scope)
    - 함수 스코프(function scope)
    - 블록 스코프(block scope)
    
    하위 스코프에서는 상위 스코프에 존재하는 변수에 접근가능하다.
    
    변수의 탐색(참조)은 하위스코프(현재위치)에서 상위스코프로 순차적으로 진행된다.
    
    ## 이벤트 시스템
    
    ---
    
    **버블링**(**Bubbling) 이벤트:**
    
    하위 Element에 이벤트가 발생하였을때 상위 Element로 이벤트가 확산되는 매커니즘.
    
    ```tsx
    function eventLogger({target, currentTarget, eventPhase}) {
    	// target: 최초로 이벤트를 발생시킨 요소
    	// currentTarget: 현재 이벤트를 받은 요소(버블링 포함)
      // eventPhase: 최초로 이벤트를 발생시킨 것인지, 버블링을 통해 전파된 것인지 구분
    }
    ```
    
    **캡처링**(**Capturing**) **이벤트:**
    
    버블링 매커니즘과 반대로 작동한다.
    
    하위 Element에 이벤트가 발생하면 해당 요소의 최상위 엘리먼트로부터 해당 Element까지 이벤트가 전파된다.
    
    ## 동시성제어(Concurrency) ****& **이벤트 루프(Event Loop)**
    
    ---
    
    [추천 영상 링크](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
    
    ## 클로저(Closure)
    
    ---
    
    ## 전역 공간을 위한 클래스 생성
    
    ---
    
    - [ ]  접근제어(private, protected 지시어):
    중요한 데이터에 대한 읽기, 쓰기 작업을 관리하기 위해서 클래스 멤버
    - [ ]