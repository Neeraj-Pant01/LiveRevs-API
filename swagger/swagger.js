const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition:{
        openapi: '3.0.0',
        info:{
            title:'revYouStar',
            version: '1.0.0',
            version:'API documentation'
        },
        components:{
            securitySchemes:{
                bearerAuth:{
                    type: 'http',
                    scheme:'bearer',
                    bearerFormat:'JWT'
                }
            }
        },
        security:[{
            bearerAuth:[]
        }],

        servers:[
            {
                url:'http://localhost:9000/api/v1'
            }
        ]
    },
    apis:["./routes/*.js"]
}

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec