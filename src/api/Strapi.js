import axios from 'axios';


var Strapi = function (host,apiHost) {
    this.host = host ? host : 'http://172.20.10.2:1337/';
    this.apiHost = apiHost ? apiHost : 'http://172.20.10.2:1337/';
    // this.port = config.port;
}


Strapi.prototype.apiSearch = function (data,type) {
    // var data = {}
    const config = {
        method: 'get',
        url: type == 'wni' ? this.apiHost + '/spri/'+ data : this.apiHost + '/intal/' + data,
        // headers: this.headers,
        // data : data
    };
    console.log(config)
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}

Strapi.prototype.findPassportbyCode = function (req) {
    var config = {
        method: 'get',
        url: this.host + '/paspors/' + req,
        headers: { 
            'Content-Type': 'application/json'
          }
    };
    return axios(config)
    .then(function (response) {
        console.log(req)
        return response.data
    })
    .catch(function (error) {
        console.log(error,config);
        return error
    });
}
Strapi.prototype.listArchive = function (type) {
    var data = {}
    const config = {
        method: 'get',
        url: this.host + '/archives?_sort=id:DESC&type='+ type,
        // headers: this.headers,
        data : data
    };
    console.log(config)
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}

Strapi.prototype.createArchive = function (data) {
    const config = {
        method: 'post',
        url: this.host + '/archives',
        // headers: this.headers,
        data : data
    };
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}

Strapi.prototype.setArchive = function (id, status) {
    var data = {
        status : status,
        type: type
    }
    const config = {
        method: 'post',
        url: this.host + '/archives/' + id + '/' + status,
        // headers: this.headers,
        data : data
    };
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}
Strapi.prototype.deleteArchive = function (id) {
    const config = {
        method: 'delete',
        url: this.host + '/archives/' + id,
        // headers: this.headers, 
        // data : data
    };
    
    
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}

Strapi.prototype.createPassport = function (data) {
    var data = data
    const config = {
        method: 'post',
        url: this.host + '/paspors',
        headers: this.headers,
        data : data
    };
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}
Strapi.prototype.findPassport = function (val) {
    // var data = {}
    const config = {
        method: 'get',
        url: this.host + '/paspors?_q=' + val,
        // headers: this.headers,
        // data : data
    };
    console.log(config)
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}
Strapi.prototype.countPassportinArchive = function (data) {
    // var data = {}
    const config = {
        method: 'get',
        url: this.host + '/paspors?archive=' + data,
        // headers: this.headers,
        data : data
    };
    return axios(config)
    .then(function (response) {
        
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}
    
Strapi.prototype.deletePassport = function (id) {
    var data = {}
    const config = {
        method: 'delete',
        url: this.host + '/paspors/' + id,
        // headers: this.headers,
        // data : data
    };
    return axios(config)
    .then(function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error);
        return error
    });
}
export default Strapi;
