export const getColorByScore = (score:number):string => {
    let color = ""
    switch (score) {
        case 1:
        case 2:
            color = '#FF0000'; // Красный
            break;
        case 3:
            color = '#FFA500'; // Оранжевый
            break;
        case 4:
            color = '#4CAF50'; // Светло-зелёный
            break;
        case 5:
            color = '#388E3C'; // Тёмно-зелёный
            break;
        default:
            color = '#000000'; // Чёрный
            break;
    }
    return color;
}
