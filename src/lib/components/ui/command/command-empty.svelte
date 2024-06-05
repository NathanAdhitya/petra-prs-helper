<script lang="ts">
	import * as CommandPrimitive from '$lib/cmdk';
	import { cn } from '$lib/utils.js';

	type $$Props = CommandPrimitive.EmptyProps;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<CommandPrimitive.Empty class={cn('py-6 text-center text-sm', className)} {...$$restProps}>
	<slot />
</CommandPrimitive.Empty>
