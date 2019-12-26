import Vue from 'vue';

Vue.filter('ucfirst', word => word.charAt(0).toUpperCase() + word.substring(1));

Vue.filter('formatDate', dateString => {
  const date = new Date(dateString);
  const now = new Date();

  const offset = now.getTimezoneOffset() / 60;
  const hours = date.getHours();

  date.setHours(hours - offset);

  return date.toLocaleString();
});

Vue.filter('excerpt', text => {
  if (text.length > 200) {
    text = text.substring(0, 200).trim() + '...';
  }

  return text;
});
