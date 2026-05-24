import type { NavItems } from "./types";
export const NAV_ITEMS: NavItems = {
	home: {
		path: "/",
		title: "home",
	},
	blog: {
		path: "/blog",
		title: "blog",
	},
	tags: {
		path: "/tags",
		title: "tags",
	},
	about: {
		path: "/about",
		title: "about",
	},
};
export const SITE = {
	name: "Nitin Singh",
	title: "Nitin Singh | GSoC 2026 Blog",
	description: "GSoC 2026 contributor at DBpedia Hindi Chapter. Writing about NLP, Knowledge Graphs, and open source.",
	url: "https://singhhnitin.github.io",
	githubUrl: "https://github.com/singhhnitin",
	listDrafts: false,
	image: "",
	ytChannelId: "",
	author: "Nitin Singh",
	authorTwitter: "",
	authorImage: "",
	authorBio: "B.Tech CSE student at KIIT University. GSoC 2026 contributor at DBpedia Hindi Chapter. Working on fine-tuning Indic language models for Hindi knowledge graph extraction. Hindi native speaker passionate about NLP and open source.",
};
export const PAGE_SIZE = 8;
export const USE_POST_IMG_OVERLAY = false;
export const USE_MEDIA_THUMBNAIL = true;
export const USE_AUTHOR_CARD = true;
export const USE_SUBSCRIPTION = false;
export const USE_VIEW_STATS = false;
