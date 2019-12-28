<template>
  <div class="profile-container">
    <h2>Welcome {{ user.last_name }}</h2>
    <p>This is your profile where you can adjust your settings and get an overview of your activities!</p>
    <div class="profile__details">
      <Avatar/>
      <div class="profile__details-info">
        <p><strong>User name</strong></p>
        <p>{{ user.last_name }}</p>
        <p><strong>Email address</strong></p>
        <p>{{ user.email }}</p>
        <template v-if="!pwChange">
          <p><strong>Password</strong></p>
          <button class="warning small" @click="pwChange = true">Change password</button>
        </template>
        <ChangePassword v-if="pwChange" @cancel="pwChange = false"/>
      </div>
    </div>
    <div class="profile__latest-questions">
      <header>
        <h4>Latest questions asked by you</h4>
        <nuxt-link tag="button" class="success small" to="/page/create">Ask</nuxt-link>
      </header>
      <hr>
      <Spinner v-if="loading.questions" type="primary" class="big"/>
      <p v-if="!loading.questions && questions.length === 0" class="message">
        You have not asked any question yet, try it!
      </p>
      <PageList v-if="!loading.questions && questions.length" :pages="questions"/>
    </div>
    <div class="profile__latest-accepted">
      <header>
        <h4>Questions with accepted answer by you</h4>
        <nuxt-link tag="button" class="primary small" to="/">Latest questions</nuxt-link>
      </header>
      <hr>
      <Spinner v-if="loading.accepted" type="primary" class="big"/>
      <p v-if="!loading.accepted && accepted.length === 0" class="message">
        None of your answers got accepted yet, keep trying!
      </p>
      <PageList v-if="!loading.accepted && accepted.length" :pages="accepted"/>
    </div>
    <div class="profile__latest-answers">
      <header>
        <h4>Latest questions with answer by you</h4>
        <nuxt-link tag="button" class="primary small" to="/">Latest questions</nuxt-link>
      </header>
      <hr>
      <Spinner v-if="loading.answers" type="primary" class="big"/>
      <p v-if="!loading.answers && answers.length === 0" class="message">
        You have not answered any questions yet, don't be shy!
      </p>
      <PageList v-if="!loading.answers && answers.length" :pages="answers"/>
    </div>
  </div>
</template>

<script>
    import Avatar from '~/components/functional/Profile/Avatar';
    import ChangePassword from '~/components/functional/Profile/ChangePassword.vue';
    import PageList from '~/components/functional/PageList';
    import Spinner from '~/components/ui/Spinner.vue';

    export default {
        components: {
            Avatar,
            ChangePassword,
            PageList,
            Spinner,
        },
        computed: {
            user () {
                return this.$store.state.user ? this.$store.state.user : {};
            },
        },
        created () {
            this.$store.subscribe(mutation => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user) {
                        this.$router.push('/');
                    }
                }
            });
        },
        data () {
            return {
                loading: {
                    questions: true,
                    answers: true,
                    accepted: true,
                },
                questions: [],
                answers: [],
                accepted: [],
                pwChange: false,
            };
        },
        middleware: 'guard',
        mounted () {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.$cookies.get('token'),
            };

            fetch(
                this.$store.state.baseUrl
                + '/items/page?sort=-created_on&fields=id,title,content,status,tags,created_on,category.id,created_by.last_name,children.id,children.accepted,votes.*'
                + `&filter[created_by][eq]=${this.user.id}&filter[parent_page][eq]=0&filter[status][eq]=published`
                + '&limit=5',
                {
                    headers,
                },
            )
                .then(res => res.json())
                .then(data => {
                    this.loading.questions = false;
                    this.questions = data.data;
                });

            fetch(
                this.$store.state.baseUrl
                + '/items/page?sort=-created_on&fields=parent_page.*,parent_page.category.id,parent_page.created_by.id,parent_page.created_by.last_name,parent_page.children.id,parent_page.children.accepted,parent_page.votes.*'
                + `&filter[created_by][eq]=${this.user.id}&filter[parent_page][neq]=0&filter[status][eq]=published&filter[accepted][eq]=1`
                + '&limit=5',
                {
                    headers,
                },
            )
                .then(res => res.json())
                .then(data => {
                    const pages = [];

                    data.data.forEach(page => {
                        pages.push(page.parent_page);
                    });

                    this.loading.accepted = false;
                    this.accepted = pages;
                });

            fetch(
                this.$store.state.baseUrl
                + '/items/page?sort=-created_on&fields=id,title,content,status,tags,created_on,category.id,created_by.last_name,children.id,children.accepted,votes.*'
                + `&filter[children.created_by][eq]=${this.user.id}&filter[parent_page][eq]=0&filter[status][eq]=published`
                + '&limit=5',
                {
                    headers,
                },
            )
                .then(res => res.json())
                .then(data => {
                    this.loading.answers = false;
                    this.answers = data.data;
                });
        },
    };
</script>

<style lang="scss" scoped>
  .big {
    font-size: 3rem;
  }

  hr {
    border: 0;
    border-bottom: 2px solid $main-color;
    margin: 0.6rem 0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .profile-container {
    flex: 1;
    width: 90%;
    max-width: 850px;
    padding-top: 2rem;

    h2 {
      margin-bottom: 1rem;
    }

    .profile__details {
      margin-top: 2rem;
      display: flex;

      &-info {
        margin-left: 2rem;

        p {
          margin: 1rem 0;

          &:first-child {
            margin: 0;
          }
        }
      }
    }
  }

  .profile__latest-questions {
    margin-top: 2rem;
  }

  .profile__latest-accepted {
    margin-top: 3rem;
  }

  .profile__latest-answers {
    margin-top: 3rem;
  }
</style>
