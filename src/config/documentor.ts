'use strict';

import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import HapiAuthJwt from 'hapi-auth-jwt2';
import { compact } from 'lodash';

export default compact([
    {
        plugin: HapiSwagger,
        options:{
            info: {
                title: process.env.npm_package_name.toUpperCase(),
                description: process.env.npm_package_description,
                version: process.env.npm_package_version
            },
            grouping: 'tags',
            expanded: 'none',
            basePath: '/',
            documentationPath: '/explorer',
            securityDefinitions: {
                token:{
                    'type':'apiKey',
                    'name':'Authorization',
                    'in':'header',
                    'x-keyPrefix':'Bearer '
                }
            },
            security:[{token:[]}]
        }
    },
    Inert,
    Vision,
    HapiAuthJwt
]);