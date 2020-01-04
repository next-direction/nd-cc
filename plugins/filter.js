import Vue from 'vue';
import stripTags from 'striptags';

Vue.filter('ucfirst', word => word.charAt(0).toUpperCase() + word.substring(1));

Vue.filter('formatDate', dateString => {
  const date = new Date(dateString.replace(' ', 'T') + 'Z');

  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).replace(',', '');
});

Vue.filter('excerpt', text => {
  text = stripTags(text);

  if (text.length > 190) {
    text = text.substring(0, 190).trim() + '...';
  }

  return text;
});

Vue.prototype.$filters = Vue.options.filters;
