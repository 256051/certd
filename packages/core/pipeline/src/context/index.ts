import { IContext } from "../core/index.js";

export type UserContext = IContext;
export type PipelineContext = IContext;

export type PageSearch = {
  offset?: number;
  limit?: number;
  searchKey?: string;
  // sortBy?: string;
  // sortOrder?: "asc" | "desc";
};

export type PageRes = {
  offset?: number;
  limit?: number;
  total?: string;
  list: any[];
};

export class Pager {
  offset: number;
  limit: number;
  constructor(req: PageSearch) {
    this.offset = req.offset ?? 0;
    this.limit = req.limit || 50;
  }

  getPageNo() {
    const size = this.limit;
    const offset = this.offset;
    let page = Math.floor(offset / size);
    if (offset % size === 0) {
      page++;
    }
    return page;
  }

  setPageNo(pageNo: number) {
    this.offset = (pageNo - 1) * (this.limit ?? 50);
  }
}
