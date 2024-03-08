import { error, fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
type SongCommentData = {
  artist_id: string;
  comment_text: string;
  created_at: string | null;
  id: number;
  private: boolean;
  song_id: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
}[];
export const load: PageServerLoad = async ({
  locals: { supabase },
  params,
  parent,
}) => {
  const { data: songData, error: songDataErr } = await supabase
    .from("songs")
    .select(`*, profiles (id, avatar_url, username), albums(title, image_url)`)
    .eq("id", params.slug)
    .single();

  const { data: songcData, error: songcErr } = await supabase
    .from("song_comments")
    .select(`*, profiles!user_id(username, avatar_url)`)
    .eq("song_id", params.slug)
    .order("created_at", { ascending: false })
    .returns<SongCommentData>();
  if (songDataErr) {
    console.log(songDataErr);
    throw error(404, {
      message: "Song not found",
    });
  }
  if (songcErr) {
    console.log(songcErr);
    throw error(404, {
      message: "Song comments not found",
    });
  }
  const { session } = await parent();
  return {
    song: songData,
    songComments: songcData,
    session,
  };
};

export const actions: Actions = {
  insertComment: async ({ request, locals: { getSession, supabase } }) => {
    //todo - check that songid is equal
    const session = await getSession();
    if (!session) {
      return fail(400);
    }
    const formData = await request.formData();
    const commentText = formData.get("comment_text") as string;
    if (commentText.length < 1) {
      return fail(400);
    }
    /* 
    RUN pnpm add -D @coffeeandfun/google-profanity-words
    ADD THIS CODE:
    import { ProfanityEngine } from '@coffeeandfun/google-profanity-words';
    const profanityEn = new ProfanityEngine({ language: 'en' });

     const hasCurseWords = await profanityEn.hasCurseWords(commentText);
    */
    const commentPrivate = formData.get("comment_private");
    const songId = formData.get("song_id") as string;
    const artistId = formData.get("artist_id") as string;

    // todo get song id from route params
    const { data: commentInsert, error: commentErr } = await supabase
      .from("song_comments")
      .insert({
        artist_id: artistId,
        comment_text: commentText,
        private: commentPrivate ? true : false,
        song_id: songId,
        user_id: session.user.id,
      })
      .select("*, profiles!user_id(username, avatar_url)")
      .returns<SongCommentData>();

    if (commentErr) {
      console.log(commentErr);
      throw error(500, `error managing comment: ${commentErr.message}`);
    }

    return {
      success: true,
      newComment: commentInsert[0],
    };
  },
  updateComment: async ({ request, locals: { getSession, supabase } }) => {
    const session = await getSession();

    if (!session) {
      return fail(400);
    }

    const formData = await request.formData();
    // const updateSchema = zfd.formData({
    //   commentId: zfd.text(),
    //   commentIndex: zfd.text(),
    //   commentPrivate: zfd.text(),
    //   commentText: zfd.text(),
    // });
    // const result = updateSchema.safeParse(formData);
    // if (!result.success) {
    //   return fail(400);
    // }

    const commentId = formData.get("update_comment_id") as string;
    const commentIndex = formData.get("update_comment_index") as string;
    const commentPrivate = formData.get("update_private") as string;
    const commentText = formData.get("update_text") as string;

    const { data: commentUpdate, error: commentErr } = await supabase
      .from("song_comments")
      .update({
        comment_text: commentText,
        private: commentPrivate ? true : false,
      })
      .eq("id", commentId)
      .select("*, profiles!user_id(username, avatar_url)")
      .returns<SongCommentData>();

    if (commentErr) {
      fail(400);
    }
    if (commentUpdate)
      return {
        success: true,
        updatedCommentIndex: commentIndex,
        updatedComment: commentUpdate[0],
      };
    else {
      fail(400);
    }
  },
  deleteComment: async ({ request, locals: { getSession, supabase } }) => {
    const session = await getSession();

    if (!session) {
      return fail(400);
    }

    const formData = await request.formData();
    // const deleteSchema = zfd.formData({
    //   commentId: zfd.text(),
    // });
    // const result = deleteSchema.safeParse(formData);
    // if (!result.success) {
    //   return fail(400);
    // }
    const commentId = formData.get("update_comment_id") as string;
    const { error } = await supabase
      .from("song_comments")
      .delete()
      .eq("id", commentId);
    if (error) {
      return fail(400);
    }
    return { success: true, deletedComment: commentId };
  },
};
