import React from 'react';
import ReactDOM from 'react-dom';
import paypal from 'paypal-checkout';

 var Conf ={
    currency: 'EUR',
    env: 'sandbox',
    client: {
        sandbox: 'AfOEViXueKQB_yf47hoYVmSNv-cCrkK12vFYKzGQOy5_6uaQwBosuCr_uYiYkVVWSzAU2EnLA2zpmmO-',
        production:'-- id--',
    },
    locale:'es_ES',
    style:{
        label:'pay',
        color:'blue',
        size:'medium',
        shape:'pill'
    }
};
    

var Button= paypal.Button.driver('react', {React, ReactDOM});
    
export const PayPalButton= Button;
export const paypalConf= Conf;