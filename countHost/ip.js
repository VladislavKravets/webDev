const convertToBinary = num => String("00000000" + parseInt(num, 10).toString(2)).slice(-8); //Функция parseInt() принимает строку в качестве аргумента и возвращает целое число, slice() извлекает часть строки и возвращает новую строку без изменения
function onClick() {
    //Получить значения из поля ввода
    let ip = Array.from(document.querySelectorAll('input')).map(inputElement => inputElement.value)
    let cidr = document.getElementById('cidr').value; // маска
    //Проверка
    if ((ip[0] >= 0 && ip[0] <= 255) && (ip[1] >= 0 && ip[1] <= 255)
        && (ip[2] >= 0 && ip[2] <= 255) && (ip[3] >= 0 && ip[3] <= 255)
        && (cidr >= 0 && cidr <= 32)) {
        //Отображение IP-адреса
        document.getElementById('resIP').innerHTML = ip[0] + "." + ip[1] + "." + ip[2] + "." + ip[3]; //складываем полученные из полей части айпи адреса и прибавляем их к точке, получается "126" + "." + "42" + "." + ... , в конечном итоге получим строку и выведем её

        //Получение двоичных записей IP-адресов
        let ipBin = {}; // для вывода именно через 8 битов (по октетам) в js необходимо к уже существующей строке из восьми восьмёрок прибавить число полученное из парсинга и потом уменьшить строку на 8 символов
        for (let i = 1; i <= 4; i++)
            ipBin[i] = convertToBinary(ip[i])
        //Маска сети
        let mask = cidr;
        let importantBlock = Math.ceil(mask / 8);
        let importantBlockBinary = ipBin[importantBlock];
        let maskBinaryBlockCount = mask % 8;
        if (maskBinaryBlockCount === 0) importantBlock++;
        let maskBinaryBlock = "";
        let maskBlock = "";
        for (let i = 1; i <= 8; i++) {
            if (maskBinaryBlockCount >= i) { // если блок выделен как "важный" т.е. попадает в октет маски, к примеру /16 ( то есть по октетам это два блока) то в двоичном виде маски добавляется единичка
                maskBinaryBlock += "1";
            } else { // в противном случае добавляется 0
                maskBinaryBlock += "0";
            }
        }
        //Преобразовываем блок двоичной маски в десятичный
        maskBlock = parseInt(maskBinaryBlock, 2); // указываем что нужно парсить и указываем в какой он системе исчисления, в нашем случае это строка с маской и двоичная система (для перевода в десятичную)

        //Частный и широковещательный адрес
        let netBlockBinary = "";
        let bcBlockBinary = "";
        for (let i = 1; i <= 8; i++) {
            if (maskBinaryBlock.substring(i - 1, 1) === "1") { // сравниваем часть от блока двоичной маски с единицей, в случае если это условие срабаывает добавляем к "частному" адресу (скорее всего просто адрес сети(?)) часть от "важного" блока
                netBlockBinary += importantBlockBinary.substring(i - 1, 1);
                bcBlockBinary += importantBlockBinary.substring(i - 1, 1);
            } else { // в противном случае добавляем к частному и широковещательному адресу 0 и 1
                netBlockBinary += "0";
                bcBlockBinary += "1";
            }
        }

        //Собираем всё и вся, вместе и создаем строковой контейнер переменных
        let maskRes = "";
        let maskBinary = "";
        let net = "";
        let bc = "";
        let rangeA = "";
        let rangeB = "";
        //Цикл для соединения целого блока строк
        for (let i = 1; i <= 4; i++) {
            if (importantBlock > i) {
                maskRes += "255";
                maskBinary += "11111111";
                net += parseInt(ipBin[i], 2);
                bc += parseInt(ipBin[i], 2);
                rangeA += parseInt(ipBin[i], 2);
                rangeB += parseInt(ipBin[i], 2);
            } else if (importantBlock === i) {
                maskRes += maskBlock;
                maskBinary += maskBinaryBlock;
                net += parseInt(netBlockBinary, 2);
                bc += parseInt(bcBlockBinary, 2);
                rangeA += (parseInt(netBlockBinary, 2) + 1);
                rangeB += (parseInt(bcBlockBinary, 2) - 1);
            } else {
                maskRes += 0;
                maskBinary += "00000000";
                net += "0";
                bc += "255";
                rangeA += 0;
                rangeB += 255;
            }
            if (i < 4) {
                maskRes += ".";
                //maskBinary += ".";
                net += ".";
                bc += ".";
                rangeA += ".";
                rangeB += ".";
            }
        }

        //Вывод результатов на страницу
        document.getElementById('resMask').innerHTML = maskRes;
        document.getElementById('resNet').innerHTML = net;
        document.getElementById('resBC').innerHTML = bc;
        document.getElementById('resRange').innerHTML = rangeA + " - " + rangeB;
        document.getElementById('hosts').innerHTML = getCountHost(maskBinary).toString();
    } else {
        alert("Input Error");
    }
}

function getCountHost(maskBinary){
    let zero = 0;
    for (let i = 0; i < maskBinary.length; i++) {
        console.log(maskBinary[i])
        if (Number(maskBinary[i]) === 0) {
            zero++;
        }
    }
    return Math.abs((Math.pow(2, zero) - 2));
}