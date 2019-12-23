import Vue from 'vue';

Vue.filter('ucfirst', word => word.charAt(0).toUpperCase() + word.substring(1));
