<script lang="ts">
  import type { PageData } from "./$types";
  import Avataricon from "$lib/ui/avataricon.svelte";
  import Playbutton from "$lib/ui/playbutton.svelte";
  import Queuebutton from "$lib/ui/queuebutton.svelte";
  import Savebutton from "$lib/ui/savebutton.svelte";
  import Albumimage from "$lib/ui/albumimage.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { addToast } from "$lib/stores";
  import { enhance } from "$app/forms";
  import tooltip from "$lib/utils/tooltip";
  export let data: PageData;

  let { song, songComments, session } = data;
  let songPlayerData = {
    artistId: song.artist_id ?? "",
    artistName: song.profiles?.username ?? "",
    id: song.id,
    name: song.name ?? "",
    songUrl: song.song_url ?? "",
  };
  let allComments = session?.user
    ? songComments.filter((c) => c.user_id !== session?.user.id)
    : null;
  let userComments = songComments.filter((c) => c.user_id === session?.user.id);
  // let loading = false;

  let insertTextarea: HTMLTextAreaElement;
  let insertCheckbox: HTMLInputElement;

  //todo - create handleDelete, handleUpdate and handleInsert. Stop sharing one submit function for many actions...

  const handleUpdate: SubmitFunction = ({ cancel }) => {
    if (!session) {
      cancel();
    }
    return async ({ result, update }) => {
      if (result.type === "success") {
        if (result.data?.updatedComment) {
          userComments[result.data.updatedCommentIndex] =
            result.data.updatedComment;
          addToast({
            dismissable: true,
            message: "Comment updated",
            timeout: 5000,
            type: "info",
          });
        }
        if (result.data?.deletedComment) {
          window.location.reload();
        }
      } else {
        addToast({
          dismissable: true,
          message:
            "Failed to update comment, ensure your comment is at least 1 character and does not include profanity. Contact support if there is a clear issue.",
          timeout: 5000,
          type: "failure",
        });
      }
      // loading = false;
    };
  };

  const handleSubmit: SubmitFunction = ({ cancel }) => {
    if (!session) {
      cancel();
      addToast({
        dismissable: true,
        message: "Sign up for an account with Google or Discord in the header",
        timeout: 5000,
        type: "failure",
      });
    }

    // loading = true;
    return async ({ result, update }) => {
      if (result.type === "success") {
        if (result.data?.newComment) {
          userComments = [result.data.newComment, ...userComments];
          insertTextarea.value = "";
          insertCheckbox.checked = false;
          addToast({
            dismissable: true,
            message: "Comment added",
            timeout: 5000,
            type: "success",
          });
        } else {
        }
      } else {
        addToast({
          dismissable: true,
          message:
            "Failed submission, ensure your comment is at least 1 character and does not include profanity. Contact support if there is a clear issue.",
          timeout: 5000,
          type: "failure",
        });
      }
      // loading = false;
    };
  };

  //make sure deleting works smoothly after edited, random edge case
  const handleCommentEdit = (id: number) => {
    let commentCheckBox = document.getElementById(
      `update_private_${id}`
    ) as HTMLInputElement;
    let editBtn = document.getElementById(
      `update_edit_${id}`
    ) as HTMLButtonElement;
    let cancelBtn = document.getElementById(
      `update_cancel_${id}`
    ) as HTMLButtonElement;
    let txtArea = document.getElementById(
      `update_text_${id}`
    ) as HTMLTextAreaElement;

    if (
      txtArea.value !== userComments[id].comment_text ||
      commentCheckBox.checked !== userComments[id].private
    ) {
      editBtn.disabled = false;
      cancelBtn.disabled = false;
    } else {
      editBtn.disabled = true;
      cancelBtn.disabled = true;
    }
  };

  const handleCommentCancel = (e: any) => {
    let commentIndex = e.target.id.replace("update_cancel_", "");
    let editBtn = document.getElementById(
      `update_edit_${commentIndex}`
    ) as HTMLButtonElement;
    let cancelBtn = document.getElementById(
      `update_cancel_${commentIndex}`
    ) as HTMLButtonElement;
    let txtArea = document.getElementById(
      `update_text_${commentIndex}`
    ) as HTMLTextAreaElement;
    let commentCheckBox = document.getElementById(
      `update_private_${commentIndex}`
    ) as HTMLInputElement;
    txtArea.value = userComments[commentIndex].comment_text;
    commentCheckBox.checked = userComments[commentIndex].private;
    editBtn.disabled = true;
    cancelBtn.disabled = true;
  };
</script>

<section aria-labelledby="song-heading">
  <h1 id="song-heading">
    {song.name} by
    <a href="/profiles/{song.profiles?.id}" class="styled-link">
      {song.profiles?.username}
    </a>
  </h1>
  <div class="grid-1">
    <div
      class="card"
      style=" display:flex; flex-direction:column; align-items:center; justify-content: center; "
    >
      <Albumimage
        url={song.albums?.image_url ?? ""}
        size={12}
        altText={`${song.albums?.title} Album Photo` ?? "No title, loading"}
      />
      <article>
        <h1>
          <span style="font-family: League Spartan, sans-serif;"
            >Part of {song.profiles?.username}'s Album:
          </span>
          <div
            class="styled-link"
            use:tooltip={{ content: "album pages are coming soon" }}
          >
            {song.albums?.title}
          </div>
        </h1>
      </article>
      <article class="row-container">
        <Playbutton songData={songPlayerData} />
        <Queuebutton songData={songPlayerData} />
        <Savebutton songId={song.id} songUrl={song.song_url ?? ""} />
      </article>
    </div>
    <div class="card">
      <Avataricon
        altText={song.profiles?.username ?? "No avatar"}
        size={5}
        url={song.profiles?.avatar_url ?? ""}
      />

      <p>
        "{song.lyrics ?? "No lyrics for this one."}"
      </p>
    </div>
  </div>

  <section aria-labelledby="comments-heading">
    <h1 id="comments-heading">Comments</h1>
    {#if session && session.user.id !== song.artist_id}
      <article class="card">
        <form
          aria-label="Write a comment"
          class="input-group"
          use:enhance={handleSubmit}
          action="?/insertComment"
          method="post"
        >
          <textarea
            bind:this={insertTextarea}
            placeholder="Write your comment..."
            rows="5"
            name="comment_text"
          />

          <div
            style="width: fit-content;"
            use:tooltip={{
              content: "Private to you and the artist",
            }}
          >
            <input
              bind:this={insertCheckbox}
              type="checkbox"
              name="comment_private"
              id="comment_private_id"
            />
            <label for="comment_private_id"> Set Private</label>
          </div>
          <input readonly hidden name="song_id" value={song.id} />
          <input readonly hidden name="artist_id" value={song.artist_id} />
          <button style="width:fit-content" class="styled-button" type="submit">
            Submit Comment
          </button>
        </form>
      </article>
    {/if}
    <section
      aria-label="List of all comments"
      style="display:flex; flex-direction: column; gap: 1rem; margin-top: 1rem"
    >
      {#each userComments as u, id}
        <article class="card" id="user_comment_{u.id}">
          <form
            method="post"
            aria-label="Edit Comment: ({u.comment_text})"
            class="input-group"
            style="row-gap: 0.5rem;"
            action="?/updateComment"
            use:enhance={handleUpdate}
          >
            <h1 style="font-size: 1rem;">{u.profiles.username} (You)</h1>
            <textarea
              on:input={() => handleCommentEdit(id)}
              class="editable-text"
              id="update_text_{id}"
              name="update_text"
              rows="5">{u.comment_text}</textarea
            >
            <div style="display: flex; flex-direction: row;">
              <div>
                <input
                  checked={u.private ? true : false}
                  type="checkbox"
                  on:input={() => handleCommentEdit(id)}
                  name="update_private"
                  id="update_private_{id}"
                />
                <label for="update_private_{id}">Set Private</label>
              </div>
              <div
                style="display:flex; flex-direction: row; margin-left:auto; gap: 0.5rem"
              >
                <input hidden name="update_comment_index" value={id} />
                <input hidden name="update_comment_id" value={u.id} />

                <button
                  id="update_edit_{id}"
                  type="submit"
                  class="styled-button"
                  disabled>Edit</button
                >
                <button
                  id="update_cancel_{id}"
                  on:click={handleCommentCancel}
                  class="styled-button"
                  disabled>Cancel</button
                >
                <button
                  id="update_delete_{id}"
                  formaction="?/deleteComment"
                  class="styled-button">Delete</button
                >
              </div>
            </div>
            <p>
              {new Date(u.created_at ?? "").toLocaleDateString()}
            </p>
          </form>
        </article>
      {/each}
      {#each allComments ?? songComments as s}
        <article class="card">
          <a class="comment-profile" href="/profiles/{s.user_id}" style="">
            <Avataricon
              size={3}
              url={s.profiles.avatar_url ?? ""}
              altText="Image of {s.profiles.username}"
            />
            <p>
              {s.profiles.username}
            </p>
          </a>
          <p>
            {s.comment_text}
          </p>
          <button
            class="styled-button"
            use:tooltip={{ content: "Coming Soon" }}
          >
            Report</button
          >
        </article>
      {/each}
      {#if userComments.length === 0 && session}
        <p>You have no comments on this song yet</p>
      {/if}
      {#if songComments.length === 0}
        <p>There are no comments from others on this song yet</p>
      {/if}
    </section>
  </section>
</section>

<style>
  .grid-1 {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(2, 1fr);
    gap: 1rem;
    justify-content: center;
  }
  @media only screen and (min-width: 1024px) {
    .grid-1 {
      grid-template-rows: 1fr;
      grid-template-columns: 3fr 1fr;
    }
  }
  .editable-text {
    resize: none;
    font-family: "League Spartan";
    /* background: none; */
  }
  .comment-profile {
    font-weight: bold;
    font-size: 1rem;
    font-family: Sono, sans-serif;
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    width: fit-content;
    text-decoration: none;
    color: var(--text-color);
    transition: all 0.3s ease;
  }
  .comment-profile:hover {
    text-decoration: underline;
    color: var(--primary-color);
  }
</style>
