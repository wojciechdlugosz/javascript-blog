'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  articleTagLink: Handlebars.compile(document.querySelector('#template-article-tag-link').innerHTML),
  articleAuthorLink: Handlebars.compile(document.querySelector('#template-article-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorListLink: Handlebars.compile(document.querySelector('#template-author-list-link').innerHTML)
};

const opts = {
  optArticleSelector: '.post',
  optTitleSelector: '.post-title',
  optTitleListSelector: '.titles',
  optArticleTagsSelector: '.post-tags .list',
  optArticleAuthorSelector: '.post-author',
  optTagsListSelector: '.tags.list',
  optAuthorsListSelector: '.list.authors',
  optCloudClassCount: 5,
  optCloudClassPrefix: 'tag-size-',
};

function generateTitleLinks(customSelector = ''){

  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(opts.optTitleListSelector);
  titleList.innerHTML = '';

  /* [DONE] find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(opts.optArticleSelector + customSelector);

  let html = '';

  /* [DONE] for each article */
  for (let article of articles) {
    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');

    /* [DONE] find the title element */
    /* [DONE] get the title from the title element */
    const articleTitle = article.querySelector(opts.optTitleSelector).innerHTML;

    /* [DONE] create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);

    /* [DONE] insert link into titleList - insertAdjacentHTML */
    //titleList.insertAdjacentHTML("beforeend", linkHTML);

    /* insert link into html variable */
    html = html + linkHTML;

  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}

const titleClickHandler = function () {
  event.preventDefault();

  const clickedElement = this;

  /* [DONE] remove class 'active' from all article links  */

  const activeLinks = document.querySelectorAll('.titles a.active');

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }

  /* [DONE] add class 'active' to the clicked link */

  clickedElement.classList.add('active');

  /* [DONE] remove class 'active' from all articles */

  const activeArticles = document.querySelectorAll('.post.active');

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }

  /* [DONE] get 'href' attribute from the clicked link */

  const articleSelector = clickedElement.getAttribute('href');

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */

  const targetArticle = document.querySelector(articleSelector);

  /* [DONE] add class 'active' to the correct article */

  targetArticle.classList.add('active');
};

generateTitleLinks();

// ... ///

function calculateTagsParams(tags){

  const params =
  {
    min: 999999,
    max: 0
  };

  for(let tag in tags){
    //console.log(tag + ' is used ' + tags[tag] + ' times');
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }

  return params;

}

function calculateTagClass(count, params){

  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opts.optCloudClassCount - 1) + 1 );

  return opts.optCloudClassPrefix + classNumber;

}

function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagsWrapper = article.querySelector(opts.optArticleTagsSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */
      //const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      const tagHTMLData = {id: tag, tag: tag};
      const tagHTML = templates.articleTagLink(tagHTMLData);

      /* add generated code to HTML variable */
      html = html + tagHTML;

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }

    /* insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);

  /* [NEW] create variable for all links HTML code */
  //let allTagsHTML = '';
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){

    /* [NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = '<li><a class="' + calculateTagClass(allTags[tag], tagsParams) +  '" href="#tag-' + tag + '">' + tag + '</a></li>' /*+ ' (' + allTags[tag] + ') '*/;

    //allTagsHTML += tagLinkHTML;
    allTagsData.tags.push({tag: tag, count: allTags[tag], className: calculateTagClass(allTags[tag], tagsParams)});

  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  //tagList.innerHTML = allTagsHTML;
  tagList.innerHTML = templates.tagCloudLink(allTagsData);

}

generateTags();

// ... ///

function tagClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeLinksToTag = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for (let activeLinkToTag of activeLinksToTag) {

    /* remove class active */
    activeLinkToTag.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksWithHref = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLinkWithHref of tagLinksWithHref) {

    /* add class active */
    tagLinkWithHref.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){

  /* find all links to tags */
  const linksToTag = document.querySelectorAll('.list a[href^="#tag-"]');

  /* START LOOP: for each link */
  for (let linkToTag of linksToTag) {

    /* add tagClickHandler as event listener for that link */
    linkToTag.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();

// ... ///

function generateAuthors(){

  /* create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles) {

    /* find tags wrapper */
    const tagWrapper = article.querySelector(opts.optArticleAuthorSelector);

    /* make html variable with empty string */
    let html = '';

    /* get tags from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');

    /* generate HTML of the link */
    //const linkHTML = 'by <a href="#author-' + articleAuthor + '">' + articleAuthor + '</a>';
    const authorLinkData = {id: articleAuthor, author: articleAuthor};
    const authorLink = templates.articleAuthorLink(authorLinkData);

    /* add generated code to HTML variable */
    html = html + authorLink;

    /* insert HTML of all the links into the tags wrapper */
    tagWrapper.innerHTML = html;

    /* check if this link is NOT already in allAuthors */
    if (!allAuthors[articleAuthor]) {
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

  /* END LOOP: for every article: */
  }

  /* find list of authors in right column */
  const authorList = document.querySelector(opts.optAuthorsListSelector);

  //let html = '';
  const allAuthorsData = {author: []};

  /* add links authors and count articles */
  for (let author in allAuthors) {
    //const authorHTML = '<li><a href="#author-' + author + '"><span class="author-name">' + author + '</span> (' + allAuthors[author] + ')</a></li>';
    //html += authorHTML;
    allAuthorsData.author.push({author: author, count: allAuthors[author]});
  }

  /*  add html */
  //authorList.innerHTML = html;

  /* add template to html */
  authorList.innerHTML = templates.authorListLink(allAuthorsData);

}

generateAuthors();

// ... //

function authorClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#author-', '');

  /* find all tag links with class active */
  const activeLinksToTag = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active tag link */
  for (let activeLinkToTag of activeLinksToTag) {

    /* remove class active */
    activeLinkToTag.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinksWithHref = document.querySelectorAll('a[href="' + href + '"]');

  /* START LOOP: for each found tag link */
  for (let tagLinkWithHref of tagLinksWithHref) {

    /* add class active */
    tagLinkWithHref.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + tag + '"]');

}

// ... //

function addClickListenersToAuthors(){

  /* find all links to authors */
  const linksToAuthor = document.querySelectorAll('.post-author a[href^="#author-"], .authors a[href^="#author-"]');

  /* START LOOP: for each link */
  for (let linkToAuthor of linksToAuthor) {

    /* add tagClickHandler as event listener for that link */
    linkToAuthor.addEventListener('click', authorClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
