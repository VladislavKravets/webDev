// Квадратное уравнение вида ax^2-bx+c=0
// let a = 4
// let b = -3
// let c = 1
//
// let D = b^2-4*a*c;
// if(D===0 || D>0) {
//     let x1 = (b + Math.sqrt(D)) / 2 * a;
//     let x2 = (b - Math.sqrt(D)) / 2 * a;
//     console.log(x1 + " " + x2)
// }else{
//     console.log("Немає дійсних коренів.")
// }

let text = [];

function makeId(amount, length, sample) { // входящие количество/размер/Параметры генерации выходящие масив с елементами
    const start = new Date().getTime();
    let result = [];
    for (let j = 0; j < amount; j++) {
        let res = "";
        do {
            for (let i = 0; i < length; i++) {
                res += sample.charAt(Math.random() * sample.length);
            }
        } while (!result.indexOf(res) === -1)
        result[j] = res;
    }
    alert('Операція зайняла: ' + (new Date().getTime() - start) + 'ms');
    return result;
}

document.getElementById('generate').onclick = function () {
    text = makeId(document.getElementById("amount").value,
        document.getElementById("length").value,
        document.getElementById("sample").value);
}
document.getElementById('toRead').onclick = function () {
    if (text.length != 0) {
        document.getElementById("result").innerHTML = ""
        for (const element of text) {
            document.getElementById("result").innerHTML += element + " <br/>";
        }
    } else { alert("Ви не згенерували індентифікатори") }
}
document.getElementById('toDownload').onclick = function () {
    if (text.length != 0) {
        const start = new Date().getTime();
        let text1 = "";
        for (const element of text) {
            text1 += element + "\n";
        }
        let myData = 'data:application/txt;charset=utf-8,' + text1;
        this.href = myData;
        this.download = 'data.txt';
        alert('Операція зайняла: ' + (new Date().getTime() - start) + 'ms');
    } else { alert("Ви не згенерували індентифікатори"); }
}


