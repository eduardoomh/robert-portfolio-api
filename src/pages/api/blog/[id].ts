import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  try {
    const response = await fetch(
      `${import.meta.env.BLOG_BASE_URL}/wp-json/wp/v2/posts/${id}?_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Error al obtener el post con id ${id}` }),
        { status: 500 }
      );
    }

    const post = await response.json();

    const formattedPost = {
      id: post.id,
      date: post.date,
      slug: post.slug,
      status: post.status,
      title: post.yoast_head_json.title,
      description: post.yoast_head_json.description,
      content: post.content.rendered,
      excerpt: post.excerpt.rendered,
      author: post.yoast_head_json.author,
      thumbnail: post.yoast_head_json.schema['@graph'][0].thumbnailUrl,
      keywords: post.yoast_head_json.schema['@graph'][0].keywords,
    };

    return new Response(JSON.stringify(formattedPost), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Error del servidor' }), {
      status: 500,
    });
  }
};