<template>
	<div id="app">
		<router-view></router-view>
	</div>
</template>

<script>
	export default {
		name: 'app'
	}
</script>

<style>
	#app,
	body,
	html {
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
</style>