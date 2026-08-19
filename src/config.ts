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
	name: "GSoC'26 × DBpedia",
	title: "GSoC'26 × DBpedia",
	description: "GSoC 2026 Contributor at DBpedia Hindi Chapter.",
	url: "https://singhhnitin.github.io",
	githubUrl: "https://github.com/singhhnitin",
	listDrafts: false,
	author: "Nitin Singh",
	authorBio:
		"B.Tech CSE student at KIIT University. GSoC 2026 contributor at DBpedia Hindi Chapter, working on Hindi NLP, knowledge graphs, and relational triple extraction.",
};

export const PAGE_SIZE = 8;
export const USE_POST_IMG_OVERLAY = false;
export const USE_MEDIA_THUMBNAIL = true;
export const USE_AUTHOR_CARD = false;
export const USE_SUBSCRIPTION = false;
export const USE_VIEW_STATS = false;
