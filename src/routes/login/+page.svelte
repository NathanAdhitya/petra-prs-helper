<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';
	import BgBottomLeft from './bg-bottom-left.svelte';
	import BgTopRight from './bg-top-right.svelte';

	import pcuLogoWhite from './pcu-white-logo.png';
	import { onMount } from 'svelte';
	import { titleStore } from '$lib/stores';

	onMount(() => ($titleStore = 'Login'));
</script>

<div class="flex min-h-screen w-full flex-row items-center justify-center bg-blue-950 p-4">
	<div class="z-10 flex max-w-md flex-col items-center justify-center gap-4">
		<img src={pcuLogoWhite} alt="PCU Logo" class="w-2/3" />
		<div class="flex items-center justify-center rounded-lg bg-white p-8">
			<div class="mx-auto grid gap-6">
				<div class="grid gap-2 text-center">
					<h1 class="text-3xl font-bold">Login ke SIM Petra</h1>
					<p class="text-balance text-muted-foreground">Gunakan email dan password Petra Anda</p>
				</div>
				<div class="grid gap-4">
					<div class="grid gap-2">
						<Label for="email">Username</Label>
						<Input id="email" type="text" required />
					</div>
					<div class="grid gap-2">
						<Label for="domain">Domain</Label>
						<Select.Root>
							<Select.Trigger class="w-full" id="domain" value="john">
								<Select.Value />
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="john">@john.petra.ac.id</Select.Item>
								<Select.Item value="peter">@peter.petra.ac.id</Select.Item>
							</Select.Content>
						</Select.Root>
					</div>
					<div class="grid gap-2">
						<div class="flex items-center">
							<Label for="password">Password</Label>
							<a href="##" class="ml-auto inline-block text-sm underline"> Lupa password? </a>
						</div>
						<Input id="password" type="password" required />
					</div>
					<Button type="submit" class="w-full" href="/berita">Login</Button>
				</div>
			</div>
		</div>
	</div>
	<BgBottomLeft class="absolute bottom-0 left-0 h-auto w-1/4 " />
	<BgTopRight class="absolute right-0 top-0 h-auto w-1/3" />
</div>
