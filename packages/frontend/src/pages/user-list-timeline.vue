<template>
<MkStickyContainer>
	<template #header><MkPageHeader :actions="headerActions" :tabs="headerTabs"/></template>
	<div ref="rootEl" class="eqqrhokj">
		<div v-if="queue > 0" class="new"><button class="_buttonPrimary" @click="top()">{{ i18n.ts.newNoteRecived }}</button></div>
		<div class="tl">
			<XTimeline
				ref="tlEl" :key="listId"
				class="tl"
				src="list"
				:list="listId"
				:sound="true"
				@queue="queueUpdated"
			/>
		</div>
	</div>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, watch, inject } from 'vue';
import XTimeline from '@/components/MkTimeline.vue';
import { scroll } from '@/scripts/scroll';
import * as os from '@/os';
import { useRouter } from '@/router';
import { definePageMetadata } from '@/scripts/page-metadata';
import { i18n } from '@/i18n';

const router = useRouter();

const props = defineProps<{
	listId: string;
}>();

let list = $ref(null);
let queue = $ref(0);
let tlEl = $shallowRef<InstanceType<typeof XTimeline>>();
let rootEl = $shallowRef<HTMLElement>();

watch(() => props.listId, async () => {
	list = await os.api('users/lists/show', {
		listId: props.listId,
	});
}, { immediate: true });

function queueUpdated(q) {
	queue = q;
}

function top() {
	scroll(rootEl, { top: 0 });
}

function settings() {
	router.push(`/my/lists/${props.listId}`);
}

async function timetravel() {
	const { canceled, result: date } = await os.inputDate({
		title: i18n.ts.date,
	});
	if (canceled) return;

	tlEl.timetravel(date);
}

const headerActions = $computed(() => list ? [{
	icon: 'ti ti-calendar-time',
	text: i18n.ts.jumpToSpecifiedDate,
	handler: timetravel,
}, {
	icon: 'ti ti-settings',
	text: i18n.ts.settings,
	handler: settings,
}] : []);

const headerTabs = $computed(() => []);

definePageMetadata(computed(() => list ? {
	title: list.name,
	icon: 'ti ti-list',
} : null));
</script>

<style lang="scss" scoped>
.eqqrhokj {
	padding: var(--margin);

	> .new {
		position: sticky;
		top: calc(var(--stickyTop, 0px) + 16px);
		z-index: 1000;
		width: 100%;
		margin: calc(-0.675em - 8px - var(--margin)) 0 calc(-0.675em - 8px);

		> button {
			display: block;
			margin: var(--margin) auto 0 auto;
			padding: 8px 16px;
			border-radius: 32px;
		}
	}

	> .tl {
		background: var(--bg);
		border-radius: var(--radius);
		overflow: clip;
	}
}

@container (min-width: 800px) {
	.eqqrhokj {
		max-width: 800px;
		margin: 0 auto;
	}
}
</style>
