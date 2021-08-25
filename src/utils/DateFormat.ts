export function DateFormat (date?: Date) {
    if (!date)
        date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const d = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    let str = `${year}`;

    str += `${month < 10 ? '0' : ''}${month}`;
    str += `${d < 10 ? '0' : ''}${d}`;
    str += `${hour < 10 ? '0' : ''}${hour}`;
    str += `${minute < 10 ? '0' : ''}${minute}`;
    str += `${second < 10 ? '0' : ''}${second}`;

    return str;

}
