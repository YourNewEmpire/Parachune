<script lang="ts">
  import type { SubmitFunction } from "@sveltejs/kit";
  import type { Provider, SupabaseClient } from "@supabase/supabase-js";
  import { enhance } from "$app/forms";
  import { addToast } from "$lib/stores";
  import Discordicon from "$lib/discordicon.svelte";
  import Googleicon from "$lib/googleicon.svelte";
  import Dropmenu from "$lib/dropdown/dropmenu.svelte";
  import Dropitem from "$lib/dropdown/dropitem.svelte";
  import {
    ArrowRightOnRectangle,
    Bookmark,
    Icon,
    MusicalNote,
    UserCircle,
    CircleStack,
  } from "svelte-hero-icons";
  import { page } from "$app/stores";
  import { onMount } from "svelte";

  const links = [
    {
      text: "My Account",
      url: "/account",
      iconSrc: UserCircle,
    },
    {
      text: "Upload",
      url: "/account/upload",
      iconSrc: MusicalNote,
    },
    {
      text: "My Music",
      url: "/account/music",
      iconSrc: CircleStack,
    },
    {
      text: "My Saved Music",
      url: "/account/saved",
      iconSrc: Bookmark,
    },
  ];

  export let supabase: SupabaseClient;
  export let profile: App.PageData["profile"];
  export let session: App.PageData["session"];
  let orig: string;
  let pageUrl: string;

  onMount(() => {
    page.subscribe((p) => {
      supabase = p.data.supabase;
      profile = p.data.profile;
      session = p.data.session;
      orig = p.url.origin;
      pageUrl = p.url.pathname;
      // console.log(p.url)
    });
  });

  const _providerSignIn = async (provider: Provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${orig}/auth/callback?next=${pageUrl}`,
        scopes:
          provider === "google"
            ? "openid https://www.googleapis.com/auth/userinfo.email"
            : "",
      },
    });
    if (error) {
      addToast({
        type: "warning",
        dismissable: true,
        message: "Failed auth login, try again",
        timeout: 5000,
      });
    }
  };

  const handleSocialLogin: SubmitFunction = ({ action, cancel }) => {
    const authProviders = ["google", "discord"];
    let providerParam = action.searchParams.get("provider") as Provider;
    if (authProviders.includes(providerParam)) {
      _providerSignIn(providerParam);
    }
    cancel();
  };
</script>

{#if session}
  <Dropmenu>
    <span class="menu-toggle" slot="toggle"
      ><Icon size={"1.5rem"} src={UserCircle} />
      <h1 class="text-ellipsis">
        {profile?.username ?? session.user.email}
      </h1>
    </span>
    {#each links as l}
      <Dropitem>
        <a class="menu-item" href={l.url}>
          <Icon size={"1.5rem"} src={l.iconSrc} />
          <p>{l.text}</p>
        </a>
      </Dropitem>
    {/each}
    <Dropitem>
      <form action="/account?/signout" method="post">
        <button class="menu-item">
          <Icon src={ArrowRightOnRectangle} size={"1.5rem"} />
          <p>Log Out</p>
        </button>
      </form>
    </Dropitem>
  </Dropmenu>
{:else}
  <form method="POST" use:enhance={handleSocialLogin}>
    <div class="login">
      <button class="styled-button" formaction="?/login&provider=google">
        <Googleicon size={20} />
        Sign in with Google
      </button>
      <button class="styled-button" formaction="?/login&provider=discord">
        <Discordicon size={20} />
        Sign in with Discord
      </button>
      <button class="styled-button" disabled={true} formaction="?/withGithub"
        >Sign in with Github</button
      >
    </div>
  </form>
{/if}

<style>
  .menu-toggle {
    color: var(--text-color);
    border-radius: 0.5rem;
    padding: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5em;
  }

  .menu-item {
    inline-size: 100%;
    line-height: 1;
    text-decoration: none;
    padding: 0.5rem 0.5rem;
    color: inherit;
    display: flex;
    flex-direction: row;
    font-weight: inherit;
    font-size: 1em;
    font-family: Sono, sans-serif;
    align-items: center;
    gap: 0.5em;
  }
  .login {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
