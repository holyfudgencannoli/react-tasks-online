export default function dateObjToFormDateStr(date) {
    let dateObj = date
    let formattedDate = dateObj.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });    
    return formattedDate
}