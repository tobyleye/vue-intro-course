var eventBus = new Vue()

Vue.component('product-review', {
  template: `
    <div>
      <h2 class="tab-title">Make a Review</h2>
      
      <form class="review-form" @submit.prevent="onSubmit">
        <p class="error" v-if="errors.length">
          <b>Please correct the following error(s):</b>
          <ul>
            <li v-for="error in errors">{{ error }} </li>
          </ul>
        </p>
        <p>
          <label for="name">Name:</label>
          <input type="text" v-model="name"/>
        </p>
        <p>
          <label for="review">Review:</label>
          <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
          <label for="rating">Rating:</label>
          <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
          </select>
        </p>
        <p>
          <span style="display: block;">Would you recommend this product ?</span>
          <label>Yes👍 <input type="radio" value="yes" v-model="recommend"></label>
          <label>No👎 <input type="radio" value="no" v-model="recommend"></label>
        </p>
        <p>
          <input type="submit" value="Submit"/>
        </p>
      </form>
    </div>
  `,
  data() {
    return {
      name: null,
      rating: null,
      review: null,
      recommend: null,
      errors: []
    }
  },
  methods: {
    onSubmit() {
      this.errors = [];
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend
        }
        console.log(productReview)
        eventBus.$emit('review-submitted', productReview);

        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push('Name is required');
        if (!this.review) this.errors.push('Review is required');
        if (!this.rating) this.errors.push('Rating is required');
        if (!this.recommend) this.errors.push('Recommend is required')
      }
    }
  }
})

Vue.component('product', {
  props: ['premium'],

  template: `
  <div class="product">
    <div class="product-image">
      <img v-bind:src="image">
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>  
      <p v-if="inStock">In Stock</p>
      <p v-else>Out of Stock</p>
      <p>Shipping: {{ shipping }}</p>

      <button :class="{'disabled-button': !inStock}" @click="addToCart" :disabled="!inStock">Add to Cart</button>

      <div v-for="(variant, index) in variants" 
        :key="variant.variantId"
        class="color-box"
        :style="{backgroundColor: variant.variantColor }"
        @mouseover="updateProduct(index)"
        >
      </div>
    </div>
    <product-tabs :reviews="reviews" :productDetails="details"></product-tabs>
  </div>
  `,

  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      reviews: [],
      selectedVariant: 0,
      variants: [
      {
        variantId: 2234,
        variantColor: 'green',
        variantImage: './assets/vmSocks-green.jpg',
        variantQuantity: 10
      },

      {
        variantId: 2235,
        variantColor: 'blue',
        variantImage: './assets/vmSocks-blue.jpg',
        variantQuantity: 0
      }
      ],
      details: ["80% cotton", "20% polyster", "Gender-neutral"]
    }
  },
  methods: {
    addToCart() {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
    },
    updateProduct(index) {
      this.selectedVariant = index;
    }
  },
  mounted() {
    eventBus.$on('review-submitted', productReview => {
      this.reviews.push(productReview);
    })
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    shipping() {
      return this.premium? 'Free' : '$2.99';
    }
  }
});

Vue.component('product-tabs', {
  template: `
    <div class="product-tabs">
      <span class="tab"
        :class="{active: selectedTab === tab}"
        v-for="
        (tab, index) in tabs"
        :key="index"
        @click="selectedTab = tab">
        {{ tab }}</span>

      <div v-show="selectedTab == 'Reviews' ">
        <h2 class="tab-title">Reviews</h2>
        <p v-if="!reviews.length">There are not reviews yet</p>
        <ul v-else>
          <li v-for="review in reviews">
            <p>{{ review.name }}</p>
            <p>{{ review.rating }}</p>
            <p>{{ review.review }}</p>
          </li>
        </ul>
      </div>
      <product-review v-show="selectedTab == 'Make a Review'"></product-review>
      <div v-show="selectedTab == 'Product Details'">
        <h2 class="tab-title">Product Details</h2>
        <ul>
          <li v-for="detail in productDetails">{{ detail }}</li>
        </ul>
      </div>

      <div v-show="selectedTab == 'Shipping & Costs'">
        <h2 class="tab-title">Shipping & Costs</h2>
        <p>Shipping fees = $2.99 bitch!</p>
      </div>
    </div>
  `,
  props: ['reviews', 'productDetails'],
  data() {
    return {
      tabs: ['Reviews', 'Make a Review', 'Shipping & Costs', 'Product Details'],
      selectedTab: 'Reviews'
    }
  }
});

var app = new Vue({
  el: '#app',
  data: {
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    }
  }
});