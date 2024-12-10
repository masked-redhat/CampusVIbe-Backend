import db from "../database/news.js";
import dbProfile from "../database/profile.js";

class News {
  #newsId = null;
  #admin = false;
  #verfied = false;

  constructor(userId, params = null, file = null) {
    this.userId = userId;
    this.title = params?.title ?? null;
    this.content = params?.content ?? null;
    this.image = file?.filename ?? null;
    this.offset = params?.offset ?? "0";
    this.#newsId = params?.newsId ?? null;
    this.allNews = params?.all === "true" ?? false;
  }

  getNews = async () => {
    if (this.#newsId === null)
      return await db.getNews(this.offset, this.allNews);
    else return await db.getNewsByNewsId(this.#newsId);
  };

  isAdmin = async () => {
    const user = await dbProfile.getUserByUserId(this.userId);
    this.#admin = user?.username === "admin" ?? false;
    this.#verfied = this.#admin;
  };

  publishNews = async () => {
    const created = await db.createNews(
      this.userId,
      this.title,
      this.content,
      this.image,
      this.#verfied,
      this.#admin
    );

    this.#newsId = created.newsId;

    return created.success;
  };

  deleteNews = async () => {
    return await db.deleteNewsByNewsId(this.userId, this.#newsId);
  };

  updateNews = async () => {
    return await db.updateNews(
      this.userId,
      this.#newsId,
      this.title,
      this.content,
      this.image,
      this.#verfied
    );
  };
}

export default News;
