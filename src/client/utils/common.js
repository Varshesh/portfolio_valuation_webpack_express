const Common = {

    formatDate(date) {
        let dt = new Date(date);
        return dt.getFullYear() +
            '/' +
            ((dt.getMonth() + 1).toString().length < 2 ? ('0' + (dt.getMonth() + 1)) : (dt.getMonth() + 1)) +
            '/' +
            (dt.getDate().toString().length < 2 ? ('0' + dt.getDate()) : dt.getDate());
    },
    formatDateForServiceReq(date) {
        let dt = new Date(date);
        return dt.getFullYear() +
            '-' +
            ((dt.getMonth() + 1).toString().length < 2 ? ('0' + (dt.getMonth() + 1)) : (dt.getMonth() + 1)) +
            '-' +
            dt.getDate();
    },

}

export default Common;