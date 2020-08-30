function apiCallDisplay() {
    displayArea().innerHTML = "Variable List<br/>enter variables as \"variableName | returnType | parameters\"<br/>enter parameters as \"parameterName dataType, parameterName dataType, parameterName dataType, ...\"<br/>dataType can be typed as one letter using these hotkeys: i Int, s String, f Float<br/>if a parameter is a list instead of a single value, put an asterisk after the parameter name or data type"
    + textArea(5, "variableList")
    + generateButton("apiCallCode")
    + "<br/><br/>ViewModel Code"
    + textArea(20, "viewModelCode")
    + "API Code"
    + textArea(20, "apiCode");
}

function apiCallCode() {
    let variableList = getRows("variableList").split("|");
    variableList = variableList.filter(v => [2, 3].includes(v.length));
    variableList = variableList.map(v => [v[0], v[1],
        v.length == 2 ? [] : v[2].replace(/(?<=\*.*)\*/g, "").split(",").map(w => w.replace(/\*/g, "").trimSplit().concat([w.includes("*")]))]);
    for (let i of variableList) {
        i[2] = i[2].filter(v => v.length == 3);
        for (let j of i[2]) {
            j[1] = hotkey(j[1]);
        }
        if (i[2].filter(v => v[2]).length !== 0) {
            i.push(i[2].filter(v => v[2])[0][0]);
        } else {
            i.push("");
        }
    }
    
    let addCode = "";
    let code = `import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class MyViewModel(application: Application) : AndroidViewModel(application) {
    // declare MutableLiveData variables for use in this class`;
    
    for (let i of variableList) {
        code += `
    private val _${i[0].uncapitalize()}: MutableLiveData<${i[3] ? `List<${i[1]}?>` : `${i[1]}?`}>? = MutableLiveData()`;
        if (i[3]) {
            code += `
    private val _${i[0].uncapitalize()}Count = MutableLiveData<Int>()
    private val _${i[0].uncapitalize()}Progress = MutableLiveData<Int>()`;
        }
    }
    code += `
    private val _isDataLoading = MutableLiveData<Boolean>()
    private val _isDataLoadingError = MutableLiveData<Boolean>()
    
    // declare LiveData variables for observing in other classes`;
    for (let i of variableList) {
        code += `
    val ${i[0].uncapitalize()}: LiveData<${i[3] ? `List<${i[1]}?>` : `${i[1]}?`}>?
        get() = _${i[0].uncapitalize()}`;
        if (i[3]) {
            code += `
    val ${i[0].uncapitalize()}Count: LiveData<Int>
        get() = _${i[0].uncapitalize()}Count
    val ${i[0].uncapitalize()}Progress: LiveData<Int>
        get() = _${i[0].uncapitalize()}Progress`;
        }
    }
    code += `
    val isDataLoading: LiveData<Boolean>
        get() = _isDataLoading
    val isDataLoadingError: LiveData<Boolean>
        get() = _isDataLoadingError
    
    // fetch variables`;
    for (let i of variableList) {
        code += `
    fun fetch${i[0].capitalize()}(`;
        addCode = "";
        for (let j of i[2]) {
            addCode += `, ${j[0]}: ${j[2] ? `List<${j[1]}>` : `${j[1]}`}`;
        }
        code += `${addCode.substring(2)}) {
        val connectivityInterceptor = ConnectivityInterceptor(getApplication())
        _isDataLoading.value = true
        viewModelScope.launch {
            try {`;
        if (i[3] === "") {
            code += `
                _${i[0].uncapitalize()}?.postValue(Api.invoke(connectivityInterceptor).get${i[0].capitalize()}(`;
            addCode = "";
            for (let j of i[2]) {
                addCode += `, ${j[0]}`;
            }
            code += `${addCode.substring(2)}).body())`;
        } else {
            code += `
                _${i[0].uncapitalize()}Count.postValue(placeId.size)
                _${i[0].uncapitalize()}Progress.postValue(0)
                _${i[0].uncapitalize()}?.postValue(${i[3]}.map{${i[0].uncapitalize()}Map(connectivityInterceptor`;
            for (let j of i[2]) {
                code += `, ${j[0] == i[3] ? "it" : j[0]}`;
            }
            code += `)})`;
        }
        code += `
                _isDataLoading.postValue(false)
                _isDataLoadingError.postValue(false)
            } catch (e: NoConnectivityException) {
                _isDataLoading.postValue(false)
                _isDataLoadingError.postValue(true)
            }
        }
    }`;
        if (i[3] !== "") {
            code += `
            
    suspend fun ${i[0].uncapitalize()}Map (connectivityInterceptor: ConnectivityInterceptor`;
            for (let j of i[2]) {
                code += `, ${j[2] ? `${j[0]}Item` : j[0]}: ${j[1]}`;
            }
            code += `) : ${i[1]}? {
        val ${i[0].uncapitalize()}Loaded = Api.invoke(connectivityInterceptor).getDetails(`;
            addCode = "";
            for (let j of i[2]) {
                addCode += `, ${j[2] ? `${j[0]}Item` : j[0]}`;
            }
        code += `${addCode.substring(2)}).body()
        _${i[0].uncapitalize()}Progress.postValue(_${i[0].uncapitalize()}Progress.value!! + 1)
        return ${i[0].uncapitalize()}Loaded
    }`;
        }
    }
    code += "\n}";
    output(code, "viewModelCode");
    
    code = `import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Query

interface Api {
    // replace "API URL.json" with the URL that the API is called from
    // replace "QUERY VARIABLE" with the variable that the API uses`;
    
    for (let i of variableList) {
        code += `
    @GET("API URL.json")
    suspend fun get${i[0].capitalize()}(`;
        switch (i[2].length) {
            case 0: break;
            case 1: code += `@Query("QUERY VARIABLE") ${i[2][0][0]}: ${i[2][0][1]}`; break;
            default: {
                addCode = "";
                for (let j of i[2]) {
                    addCode += `,
        @Query("QUERY VARIABLE") ${j[0]}: ${j[1]}`;
                }
                code += addCode.substring(1); break;
            }
        }
        code += `): Response<${i[1]}>
`;
    }
    code += `
    companion object {
        operator fun invoke(
            connectivityInterceptor: ConnectivityInterceptor
        ): Api {
            val requestInterceptor = Interceptor { chain ->

                val url = chain.request()
                    .url()
                    .newBuilder()
                    .addQueryParameter("api-key", Constants.API_KEY)
                    .build()
                val request = chain.request()
                    .newBuilder()
                    .url(url)
                    .build()

                return@Interceptor chain.proceed(request)
            }

            val okHttpClient = OkHttpClient.Builder()
                .addInterceptor(requestInterceptor)
                .addInterceptor(connectivityInterceptor)
                .build()

            val userMoshi = Moshi
                .Builder()
                .build()

            return Retrofit.Builder()
                .client(okHttpClient)
                .baseUrl(Constants.BASE_URL)
                .addConverterFactory(MoshiConverterFactory.create(userMoshi))
                .build()
                .create(Api::class.java)
        }
    }
}`;
    output(code, "apiCode");
}