const _ = require('lodash');
const groups = require('../data/groups');


const uuid = () => {
  var d = Date.now();
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now(); //use high-precision timer if available
  }
  const id = 'xxxxxxxxxxxx4xxxyx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : ((r && 0x3) || 0x8)).toString(16);
  });
  return id.toUpperCase();
}

const dataSetToArray = (data, array, viewType, viewNum = 0) => {
  let start = Number(viewNum) * Number(viewType);
  let end = (Number(viewNum) + 1) * Number(viewType);
  let addData = data.slice(start, end);
  array.splice(0, addData.length, ...addData);
  if (viewType === 8) {
    array.splice(0, 0, array[0]);
  }
  const channelList = data.reduce((pre, cur) => {
    const activeObj = _.find(array, function (o) { return o.channelId === cur.channelId; });
    return [...pre, { ...cur, active: activeObj ? true : false }];
  }, []);
  return { playList: array, channelList };
}

const devicesJoinChannls = (devices, channels) => {
  let new_devices = Array.from(devices);
  const result = new_devices.reduce((pre, cur) => {
    cur['channels'] = selectByKey(channels, 'deviceUID', cur.udid);
    return [...pre, cur];
  }, [])
  console.log(devices)
  console.log(result);
  return result;
}
const channelsJoinUserMember = (channels, groups) => {
  let new_channels = channels.slice();
  const result = new_channels.reduce((pre, cur) => {
    cur['member'] = channelsMemberCount(groups, cur.channelId);
    return [...pre, cur];
  }, [])
  return result;
}

const channelsMemberCount = (groups, channelId) => {
  const channelGroups = _.uniqBy(selectByKey(groups, 'channelId', channelId), 'userId');
  return channelGroups;
}
const devicesGroupUser = (devices, groups) => {
  let new_devices = devices.slice();
  return new_devices.reduce((pre, cur) => {

    return { ...pre, [cur.udid]: groups.filter(s => s.groupId === cur.groupId) }
  }, {});

}

const groupsJoinUserChannel = (groups, users, channels) => {
  let new_groups = groups.slice();
  return new_groups.reduce((pre, cur) => {
    cur['user'] = selectByKey(users, 'userId', cur.userId);
    cur['channel'] = selectByKey(channels, 'channelId', cur.channelId);
    return [...pre, cur];
  }, [])
}

const selectByKey = (array, key, value) => {
  let new_array = array.slice();
  return new_array.filter(o => o[key] === value);
}
const insertGroups = (groups, addItems) => {
  addItems.forEach(element => {
    groups.push({ ...element, id: groups.length + 1 })
  });
  return groups;
}

const deleteGroup = (groups, deleteItems) => {
  deleteItems.forEach(element => {
    const deleteIndex = groups.findIndex(g => g.id === element.id);
    groups.splice(deleteIndex, 1);
  })
  return groups;
}

const deleteGroupById = (groups, id) => {
  const deleteIndex = groups.findIndex(g => g.id === id);
  groups.splice(deleteIndex, 1);
  return groups;
}

module.exports = {
  uuid,
  dataSetToArray,
  devicesJoinChannls,
  devicesGroupUser,
  channelsJoinUserMember,
  groupsJoinUserChannel,
  selectByKey,
  insertGroups,
  deleteGroup,
  deleteGroupById
}