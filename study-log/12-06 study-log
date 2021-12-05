# JavaScript & TypeScript 강의

- **Background**
    
    ## 호이스팅(Hoisting)
    
    ---
    
    [MDN 문서](https://developer.mozilla.org/ko/docs/Glossary/Hoisting)를 살펴보면 다음과 같이 설명하고 있습니다.
    
    *JavaScript에서 **호이스팅**(hoisting)이란, 인터프리터가 변수와 함수의 메모리 공간을 선언 전에 미리 할당하는 것을 의미합니다.*
    
    *호이스팅을 설명할 땐 주로 "변수의 **선언과 초기화를 분리**한 후, **선언만 코드의 최상단으로** 옮기는" 것으로 말하곤 합니다. 따라서 변수를 정의하는 코드보다 사용하는 코드가 앞서 등장할 수 있습니다. 다만 선언과 초기화를 함께 수행하는 경우, 선언 코드까지 실행해야 변수가 초기화된 상태가 됨을 주의하세요.*
    
    ⚠️ **let**, **const** vs **var**
    
    var 로 선언된 변수의 경우에는 undefined로 초기화하지만
    
    let, const로 선언된 변수의 경우는 초기화 되지 않기 때문에 [ReferenceError](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)를 발생시킨다.
    
    ## 인터프리터(Interpreter)
    
    ---
    
    작성중 ...
    
- **강의 내용 정리**
    
    ## 디렉토리 캡슐화
    
    ---
    
    참조할 객체가 있는 코드의 디렉토리 내부에 index.ts 파일을 추가하고
    
    ```jsx
    // export 지시어만으로 지정된 variable의 경우
    export { class_1, class_2, object } from `모듈 경로`
    // default export 지시어로 지정된 variable의 경우
    export { default as customName } from `모듈 경로`
    ```
    
    위와 같은 문법으로 작성하고,
    
    호출하여 코드에서는
    
    ```jsx
    import ${변수 이름***}*** from ***${모듈 디렉토리/모듈}***
    ```
    
    위와 같은 문법으로 참조하여 사용할 수 있다.
    
    index.ts 파일을 import 하는 경우 이름을 생략할 수 있어 모듈 디렉토리만 적어도 된다.
    
    사용하는 쪽에서 해당 디렉토리에 존재하는 모듈간의 계층구조를 신경 쓸 필요가 없기 때문에 사용한다. (인터페이스 제공으로 사용자 배려)
    
    ## 윈도우(window) 객체를 이용한 전역 변수
    
    ---
    
    window는 JS 코드 어디에서나 접근 가능한 **전역 객체**이다.
    
    특정 속성을 추가하여 전역 변수처럼 사용 가능하지만, 좋은 방법은 아니다. 
    
    Namespace의 충돌 가능이 존재한다.
    
    1. JavaScript: Dot(.) 을 이용하여 직접적으로 속성을 추가할 수 있다.
        
        ```jsx
        window.${myValue} = '원하는 데이터';
        ```
        
    2. TypeScript: 약간 복잡한 방법을 통해 이용가능하다.
        
        ```c
        declare global {
        	interface Window{
        		myValue: MyValueType;	
        	}
        }
        
        window.myValue = '원하는 데이터';
        ```
        
    
    **단점**
    
    실수로 잘못된 데이터를 세팅하거나 덮어쓰기되는 경우 
    
    완전히 의도하지 않은 방식으로 문제가 발생하고 
    
    그 문제가 어디에서 발생했는지 찾는 일 또한 매우 힘들다.
    
    ## Class Property에
    
    ## 전역 공간을 위한 클래스 생성
    
    ---
    
    - [ ]  접근제어(private, protected 지시어):
    중요한 데이터에 대한 읽기, 쓰기 작업을 관리하기 위해서 클래스 멤버
    - [ ]