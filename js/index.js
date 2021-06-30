let currentMonth = 0,
    currentDays = 0,
    currentHours = 0,//当前-小时
    currentMinutes = 0, // 当前-分钟
    currentSeconds = 0, // 当前-秒
    monthDeg = 0,
    daysDeg = 0,
    hoursDeg = 0,   //当前-小时-转动角度
    minutesDeg = 0, // 当前-分钟-转动角度
    secondsDeg = 0, // 当前-面-转动角度
    timer = null;   // 定时器

let secondsNode, minutesNode, hoursNode, daysNode, monthNode;
let arr = ['seconds', 'minutes', 'hours', 'days', 'month'];
// 分别创建父级盒子
arr.forEach((item, index) => {
    //处理天数
    if (index === 3) {
        const day = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
        data.daysTexts = data.daysTexts.splice(0, day);
    }
    initNode(item, 0, data[item + 'Texts'], data.boxSize[item])
})

// 初始话父级盒子
function initNode(node, nodeDeg, texts, boxSize) {
    //获取节点对象
    let divNode = document.getElementsByClassName(`${node}`)[0];
    //设置宽高
    divStyle(divNode, `${node}`, nodeDeg);
    //创建子节点
    createSpanNode(texts, divNode, boxSize, node);
}

// 设置父盒子大小
function divStyle(node, key, deg) {
    node.style.width = data.boxSize[key] + 'px';
    node.style.height = data.boxSize[key] + 'px';
    node.style.transform = `rotate(-${deg}deg)`
}

// 创建span子节点
function createSpanNode(texts, node, nodeSize, childNode) {
    //创建碎片节点
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < texts.length; i++) {
        //创建span节点
        let spanNode = document.createElement('span');
        spanNode.innerText = texts[i];
        spanNode.className = childNode;
        //添加样式
        spanStyle(spanNode, nodeSize, texts, i);
        //添加节点
        fragment.appendChild(spanNode);
    }
    //添加节点
    node.appendChild(fragment);
}

// span盒子样式
function spanStyle(node, size, texts, index) {
    // node：节点，size：盒子大小，texts：盒子渲染数据，index：个数
    const r = size / 2; //半径
    const deg = getPerDeg(texts); //元素平均间隔度数
    const angle = deg * index;//夹角
    const {a, b} = getHypotenuse(r, angle);
    node.style.top = a + r + 'px';
    node.style.left = b + r + 'px';
    node.style.transform = `rotate(${angle}deg)`;
    node.style.transformOrigin = '0 0';
}

// 元素平均间隔度数
function getPerDeg(texts) {
    return 360 / texts.length;
}

// 已知角度和斜边，获取直角边
function getHypotenuse(long, angle) {
    // 获得弧度
    let radian = 2 * Math.PI / 360 * angle;
    return {
        a: Math.sin(radian) * long, // 邻边
        b: Math.cos(radian) * long // 对边
    }
}

// 间隔1秒运行
function runClock() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const days = d.getDate();
    const hours = d.getHours();
    const minutes = d.getMinutes(); // 分
    const seconds = d.getSeconds(); // 秒
    if (currentMonth !== month) {
        currentMonth = month;
        monthDeg += getPerDeg(data.monthTexts);
        divStyle(monthNode, 'month', monthDeg);
        spanDynamicStyle(monthNode, currentMonth);
    }
    if (currentDays !== days) {
        currentDays = days;
        daysDeg += getPerDeg(data.daysTexts);
        divStyle(daysNode, 'days', daysDeg);
        spanDynamicStyle(daysNode, currentDays);
    }
    if (currentHours !== hours) {
        currentHours = hours;
        hoursDeg += getPerDeg(data.hoursTexts);
        divStyle(hoursNode, 'hours', hoursDeg);
        spanDynamicStyle(hoursNode, currentHours);
    }
    if (currentMinutes !== minutes) {
        currentMinutes = minutes;
        minutesDeg += getPerDeg(data.minutesTexts);
        divStyle(minutesNode, 'minutes', minutesDeg);
        spanDynamicStyle(minutesNode, currentMinutes);
    }
    currentSeconds = seconds;
    secondsDeg += getPerDeg(data.secondsTexts);
    divStyle(secondsNode, 'seconds', secondsDeg);
    spanDynamicStyle(secondsNode, currentSeconds);
}

// 获取节点
function getDivNode(classname) {
    return document.getElementsByClassName(classname)[0];
}

// 设置class类(动态)
function spanDynamicStyle(node, currentIndex) {
    if (currentIndex === 0 && node.childNodes[node.childNodes.length - 1].className.includes('active')) {
        node.childNodes[node.childNodes.length - 1].classList.remove('active');
    }
    if (currentIndex > 0 && node.childNodes[currentIndex - 1].className.includes('active')) {
        node.childNodes[currentIndex - 1].classList.remove('active');
    }
    node.childNodes[currentIndex].classList.add('active');
}

// 设置年
(function setYear() {
    let num = {0: '零', 1: '一', 2: '二', 3: '三', 4: '四', 5: '五', 6: '六', 7: '七', 8: '八', 9: '九'}
    document.getElementsByClassName('year')[0].innerText = new Date().getFullYear().toString().split('').map(item => num[item]).join('')
})();

// 首次运行
(function init() {
    const date = new Date();
    const year = date.getFullYear();
    currentMonth = date.getMonth() + 1;
    currentDays = date.getDate();
    currentHours = date.getHours();
    currentMinutes = date.getMinutes();
    currentSeconds = date.getSeconds();
    const day = new Date(year, currentMonth, 0).getDate();
    data.daysTexts = data.daysTexts.splice(0, day);
    monthDeg = (currentMonth - 1) * getPerDeg(data.monthTexts);
    daysDeg = (currentDays - 1) * getPerDeg(data.daysTexts);
    hoursDeg = (currentHours - 1) * getPerDeg(data.hoursTexts);
    minutesDeg = currentMinutes * getPerDeg(data.minutesTexts);
    secondsDeg = currentSeconds * getPerDeg(data.secondsTexts);
    arr.forEach((item, index) => {
        index === 0 ? secondsNode = getDivNode(item) : index === 1 ? minutesNode = getDivNode(item) :
            index === 2 ? hoursNode = getDivNode(item) : index === 3 ? daysNode = getDivNode(item) :
                monthNode = getDivNode(item);
    });
    divStyle(monthNode, 'month', monthDeg);
    spanDynamicStyle(monthNode, currentMonth - 1);
    divStyle(daysNode, 'days', daysDeg);
    spanDynamicStyle(daysNode, currentDays - 1);
    divStyle(hoursNode, 'hours', hoursDeg);
    spanDynamicStyle(hoursNode, currentHours - 1);
    divStyle(minutesNode, 'minutes', minutesDeg);
    spanDynamicStyle(minutesNode, currentMinutes);
    divStyle(secondsNode, 'seconds', secondsDeg);
    spanDynamicStyle(secondsNode, currentSeconds);
    // 设置定时器
    timer = setInterval(() => {
        runClock()
    }, 1000)
})();
