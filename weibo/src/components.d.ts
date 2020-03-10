/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';


export namespace Components {
  interface AboutUs {}
  interface AppRoot {}
  interface DialogContainer {
    'dialogContent': string;
    'dialogTitle': string;
  }
  interface SharingUtensil {
    'linkToShare': any;
    'text': string;
  }
  interface SinglePostViewer {
    'txid': any;
  }
  interface UserAddTags {
    'prompt': string;
  }
  interface WeiboPost {
    'downloadFromBlockchain': boolean;
    'text': string;
    'txid': string;
  }
  interface WeiboPosts {
    'hashtag': string;
  }
  interface WeiboViewer {
    'currentSearchTxid': string;
  }
}

declare global {


  interface HTMLAboutUsElement extends Components.AboutUs, HTMLStencilElement {}
  var HTMLAboutUsElement: {
    prototype: HTMLAboutUsElement;
    new (): HTMLAboutUsElement;
  };

  interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {}
  var HTMLAppRootElement: {
    prototype: HTMLAppRootElement;
    new (): HTMLAppRootElement;
  };

  interface HTMLDialogContainerElement extends Components.DialogContainer, HTMLStencilElement {}
  var HTMLDialogContainerElement: {
    prototype: HTMLDialogContainerElement;
    new (): HTMLDialogContainerElement;
  };

  interface HTMLSharingUtensilElement extends Components.SharingUtensil, HTMLStencilElement {}
  var HTMLSharingUtensilElement: {
    prototype: HTMLSharingUtensilElement;
    new (): HTMLSharingUtensilElement;
  };

  interface HTMLSinglePostViewerElement extends Components.SinglePostViewer, HTMLStencilElement {}
  var HTMLSinglePostViewerElement: {
    prototype: HTMLSinglePostViewerElement;
    new (): HTMLSinglePostViewerElement;
  };

  interface HTMLUserAddTagsElement extends Components.UserAddTags, HTMLStencilElement {}
  var HTMLUserAddTagsElement: {
    prototype: HTMLUserAddTagsElement;
    new (): HTMLUserAddTagsElement;
  };

  interface HTMLWeiboPostElement extends Components.WeiboPost, HTMLStencilElement {}
  var HTMLWeiboPostElement: {
    prototype: HTMLWeiboPostElement;
    new (): HTMLWeiboPostElement;
  };

  interface HTMLWeiboPostsElement extends Components.WeiboPosts, HTMLStencilElement {}
  var HTMLWeiboPostsElement: {
    prototype: HTMLWeiboPostsElement;
    new (): HTMLWeiboPostsElement;
  };

  interface HTMLWeiboViewerElement extends Components.WeiboViewer, HTMLStencilElement {}
  var HTMLWeiboViewerElement: {
    prototype: HTMLWeiboViewerElement;
    new (): HTMLWeiboViewerElement;
  };
  interface HTMLElementTagNameMap {
    'about-us': HTMLAboutUsElement;
    'app-root': HTMLAppRootElement;
    'dialog-container': HTMLDialogContainerElement;
    'sharing-utensil': HTMLSharingUtensilElement;
    'single-post-viewer': HTMLSinglePostViewerElement;
    'user-add-tags': HTMLUserAddTagsElement;
    'weibo-post': HTMLWeiboPostElement;
    'weibo-posts': HTMLWeiboPostsElement;
    'weibo-viewer': HTMLWeiboViewerElement;
  }
}

declare namespace LocalJSX {
  interface AboutUs {}
  interface AppRoot {}
  interface DialogContainer {
    'dialogContent'?: string;
    'dialogTitle'?: string;
  }
  interface SharingUtensil {
    'linkToShare'?: any;
    'text'?: string;
  }
  interface SinglePostViewer {
    'txid'?: any;
  }
  interface UserAddTags {
    'prompt'?: string;
  }
  interface WeiboPost {
    'downloadFromBlockchain'?: boolean;
    'text'?: string;
    'txid'?: string;
  }
  interface WeiboPosts {
    'hashtag'?: string;
  }
  interface WeiboViewer {
    'currentSearchTxid'?: string;
  }

  interface IntrinsicElements {
    'about-us': AboutUs;
    'app-root': AppRoot;
    'dialog-container': DialogContainer;
    'sharing-utensil': SharingUtensil;
    'single-post-viewer': SinglePostViewer;
    'user-add-tags': UserAddTags;
    'weibo-post': WeiboPost;
    'weibo-posts': WeiboPosts;
    'weibo-viewer': WeiboViewer;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'about-us': LocalJSX.AboutUs & JSXBase.HTMLAttributes<HTMLAboutUsElement>;
      'app-root': LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
      'dialog-container': LocalJSX.DialogContainer & JSXBase.HTMLAttributes<HTMLDialogContainerElement>;
      'sharing-utensil': LocalJSX.SharingUtensil & JSXBase.HTMLAttributes<HTMLSharingUtensilElement>;
      'single-post-viewer': LocalJSX.SinglePostViewer & JSXBase.HTMLAttributes<HTMLSinglePostViewerElement>;
      'user-add-tags': LocalJSX.UserAddTags & JSXBase.HTMLAttributes<HTMLUserAddTagsElement>;
      'weibo-post': LocalJSX.WeiboPost & JSXBase.HTMLAttributes<HTMLWeiboPostElement>;
      'weibo-posts': LocalJSX.WeiboPosts & JSXBase.HTMLAttributes<HTMLWeiboPostsElement>;
      'weibo-viewer': LocalJSX.WeiboViewer & JSXBase.HTMLAttributes<HTMLWeiboViewerElement>;
    }
  }
}


