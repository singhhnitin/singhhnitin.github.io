<script lang="ts">
    type Props = {
        slug: string
        title: string
        description: string
        category: string,
        tags: Array<string>
    }
    export let post: Props
    export let isLast: boolean = false
</script>
<div class="post-preview">
    <div class="flex-1">
        <h4 class="post-preview__title">
            <a href={`/${post.category}/${post.slug}`} title={post.title}>{post.title} &rarr;</a>
        </h4>
        <p class="post-preview__desc">
            {post.description}
        </p>
        <ul class="tag-list">
            {#each post.tags as tag}
                <a class="tag" href={`/tags/${tag}`} title={tag}>{tag}</a>
            {/each}
        </ul>
    </div>
</div>
{#if !isLast}
    <hr class="search-hr"/>
{/if}
<style lang="postcss">
    .post-preview {
        @apply flex gap-6 text-left rounded-lg transition-colors -mx-2 px-2 py-1;
    }
    .post-preview:hover {
        background: var(--accent-soft);
    }
    .post-preview__title {
        @apply text-lg leading-tight font-semibold mb-2;
        font-family: 'Fraunces', ui-serif, serif;
        color: var(--text);
    }
    .post-preview__desc {
        @apply text-base leading-5 line-clamp-2;
        color: var(--text-muted);
    }
    .tag-list {
        @apply list-none py-2 flex flex-wrap gap-2;
    }
    .tag {
        @apply inline-block text-xs px-3 py-1 rounded-full;
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        color: var(--accent-2);
        background: var(--bg-raised-2);
    }
    .search-hr {
        @apply my-4;
        border-color: var(--border);
    }
</style>
