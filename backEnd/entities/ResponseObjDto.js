//pouzivej me jako standardni envelope pro vraceni z restcontrolleru v pripade uspechu.
class ResponseObjDto {
    constructor(data, statusMessage) {
        this.statusMessage = statusMessage;
        this.length = Array.isArray(data) ? data.length : 1;
        this.data = data;
    }
}

module.exports = {ResponseObjDto};