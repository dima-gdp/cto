<template>
  <div :class="{ 'shop-ticket__basket--active': isHighlighted }" class="shop-ticket__basket">
    <feather
      class="shop-ticket__icon"
      type="shopping-bag"
      size="20"
      stroke="var(--s-black-color-80)"
    />
    <div v-if="isHighlighted" class="shop-ticket__basket-text d-none d-md-flex">
      {{ $tr('shop.product.inBasket') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isHighlighted: { type: Boolean, required: true },
  },
}
</script>
