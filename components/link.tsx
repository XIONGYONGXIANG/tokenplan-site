import NextLink, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type AppLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof LinkProps
> &
  LinkProps & { children?: ReactNode };

/**
 * 统一站内链接组件。
 *
 * 静态导出（output: export）站点里，Next Link 默认在链接进入视口时
 * 预取目标页的 RSC 载荷（index.txt?_rsc=...）。预览 iframe 渲染或快速
 * 切换时这些在途预取会被浏览器中止，控制台刷 net::ERR_ABORTED。
 * 纯静态页本身加载已很快，预取收益小，故全局关闭，彻底消除该噪音。
 * 如个别页面确需预取，可在该链接上显式传 prefetch={true} 覆盖。
 */
export function Link(props: AppLinkProps) {
  return <NextLink {...props} prefetch={props.prefetch ?? false} />;
}
