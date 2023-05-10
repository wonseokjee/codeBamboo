import { Timestamp } from 'typeorm';

export function makeLeaf(data) {
  const nickname = { nickname: data.user.nickname };
  const title = { title: data.title };
  const content = { content: data.content };
  const type = { type: data.type };
  const codes = { codes: data.codes };
  const parentLeafId = { parentLeafId: data.parent_leaf_id };
  const exportCnt = { exportCnt: data.export };
  const likeCnt = { likeCnt: data.likes.length };
  const response = {
    ...nickname,
    ...title,
    ...content,
    ...type,
    ...codes,
    ...exportCnt,
    ...parentLeafId,
    ...likeCnt,
  };
  return response;
}

export function makeTopicLeafs(data) {
  const likeCnt = { likeCnt: data.likes.length };
  const { user, likes, topic, ...obj } = data;
  data = obj;
  const response = {
    ...likeCnt,
    ...data,
  };
  return response;
}

export function searchTopic(data) {
  const topic_id = { topic_id: data.topic_id };
  const needHelp = { needHelp: data.needHelp };
  const creation_time = { creation_time: data.creation_time };
  const rootLeaf = { rootLeaf: makeLeaf(data.rootLeaf) };
  const bestLeaf = { bestLeaf: makeLeaf(data.bestLeaf) };
  // const leafs = { leafs: data.leafs.map((data) => makeLeaf(data)) };
  const response = {
    ...topic_id,
    ...needHelp,
    ...creation_time,
    ...rootLeaf,
    ...bestLeaf,
  };
  return response;
}

export function popularTopic(payload) {
  // console.log(payload);
  const leafs = payload.leafs;
  // console.log(leafs);
  const leaf = leafs.map((data) => popularLeaf(data));
  // console.log(leaf);
  let leafCnt = 0;
  for (let index = 0; index < leaf.length; index++) {
    leafCnt += leaf[index];
  }
  const topicCnt = { topic_id: payload.topic_id, value: leafCnt };
  // console.log(topicCnt);
  return topicCnt;
}

function popularLeaf(data) {
  let sum = 0;
  sum += data.export;
  sum += data.likes.length;
  sum += data.bookmarks.length;
  return sum;
}

export function trendingTopic(data) {
  // console.log(data);
  const time = new Date();
  const year = time.getFullYear(); // 년
  const month = time.getMonth(); // 월
  const day = time.getDate(); // 일
  const hour = time.getHours();
  const weekago = new Date(year, month, day - 7, hour);

  // console.log(data.leafs.length);
  let leafsCnt = 0;
  for (let index = 0; index < data.leafs.length; index++) {
    const element = data.leafs[index];
    // console.log(element.creation_time);
    if (element.creation_time > weekago) {
      leafsCnt += 1;
    }
  }
  // console.log(weekago);
  return { topic_id: data.topic_id, value: leafsCnt };
}