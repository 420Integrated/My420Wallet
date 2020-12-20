<template>
  <div class="footer">
    <div class="wrap">
      <div>
        <div class="flex-space-between foot-note">
          <div class="links">
            <div v-for="(link, index) in lowerLinks" :key="link.title + index">
              <router-link v-if="link.hasOwnProperty('to')" :to="link.to">
                <span>{{ $t(link.title) }}</span>
              </router-link>
              <a
                v-else
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>{{ $t(link.title) }}</span>
              </a>
            </div>
          </div>
          <div class="copyright">
            <p>
              {{ $t('footer.pricing-p') }}
              <a
                href="https://coingecko.com/"
                target="_blank"
                rel="noopener noreferrer"
                >{{ $t('footer.coingecko') }}</a
              >
              <br />
              {{ $t('footer.copyright') }}
            </p>
          </div>
          <div class="social">
            <a
              v-for="link in links"
              :key="link.class"
              :href="link.to"
              :aria-label="link.to"
              rel="noopener noreferrer"
              target="_blank"
            >
              <i :class="'fa ' + link.class" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const version = VERSION;
import { Misc } from '@/helpers';

export default {
  data() {
    const isMewCx = Misc.isMewCx();
    return {
      isMewCx: isMewCx,
      version: version,
      lowerLinks: [
        {
          title: 'footer.feedback',
          href: 'mailto:support@my420wallet.420integrated.com'
        },
        {
          title: 'footer.privacy',
          to: '/privacy-policy'
        },
        {
          title: 'common.terms',
          to: '/terms-of-service'
        },
        {
          title: `v${version}`,
          href: `https://github.com/420integrated/My420Wallet/releases/tag/v${version}`
        }
      ],
      links: [
        {
          to: 'https://www.facebook.com/420integrated',
          class: 'fa-facebook'
        },
        {
          to: 'https://www.twitter.com/@420integrated',
          class: 'fa-twitter'
        },
        {
          to: 'https://www.instagram.com/420integrated',
          class: 'fa-instagram'
        },
        {
          to: 'https://www.linkedin.com/company/420integrated',
          class: 'fa-linkedin'
        },
        {
          to: 'https://www.github.com/420integrated',
          class: 'fa-github'
        },
        {
          to: 'https://www.reddit.com/r/420integrated',
          class: 'fa-reddit-alien'
        },
        {
          to: 'https://www.medium.com/@my420wallet',
          class: 'fa-medium'
        },
        {
          to: 'https://t.me/420integrated',
          class: 'fa-telegram'
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
@import 'CxFooter.scss';
</style>
