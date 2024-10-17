"use strict";

var utils = require("../utils");
var log = require("npmlog");

function formatEventReminders(reminder) {
  return {
    reminderID: reminder.id,
    eventCreatorID: reminder.lightweight_event_creator.id,
    time: reminder.time,
    eventType: reminder.lightweight_event_type.toLowerCase(),
    locationName: reminder.location_name,
    locationCoordinates: reminder.location_coordinates,
    locationPage: reminder.location_page,
    eventStatus: reminder.lightweight_event_status.toLowerCase(),
    note: reminder.note,
    repeatMode: reminder.repeat_mode.toLowerCase(),
    eventTitle: reminder.event_title,
    triggerMessage: reminder.trigger_message,
    secondsToNotifyBefore: reminder.seconds_to_notify_before,
    allowsRsvp: reminder.allows_rsvp,
    relatedEvent: reminder.related_event,
    members: reminder.event_reminder_members.edges.map(function (member) {
      return {
        memberID: member.node.id,
        state: member.guest_list_state.toLowerCase()
      };
    })
  };
}

function formatThreadGraphQLResponse(data) {
  var messageThread = data.o0.data.message_thread;
  var threadID = messageThread.thread_key.thread_fbid ? messageThread.thread_key.thread_fbid : messageThread.thread_key.other_user_id;

  var lastM = messageThread.last_message;
  var snippetID = lastM && lastM.nodes && lastM.nodes[0] && lastM.nodes[0].message_sender && lastM.nodes[0].message_sender.messaging_actor ? lastM.nodes[0].message_sender.messaging_actor.id : null;
  var snippetText = lastM && lastM.nodes && lastM.nodes[0] ? lastM.nodes[0].snippet : null;
  var lastR = messageThread.last_read_receipt;
  var lastReadTimestamp = lastR && lastR.nodes && lastR.nodes[0] && lastR.nodes[0].timestamp_precise ? lastR.nodes[0].timestamp_precise : null;

  return {
    threadID: threadID,
    threadName: messageThread.name,
    participantIDs: messageThread.all_participants.edges.map(d => d.node.messaging_actor.id),
    userInfo: messageThread.all_participants.edges.map(d => ({
      id: d.node.messaging_actor.id,
      name: d.node.messaging_actor.name,
      firstName: d.node.messaging_actor.short_name,
      vanity: d.node.messaging_actor.username,
      thumbSrc: d.node.messaging_actor.big_image_src.uri,
      profileUrl: d.node.messaging_actor.big_image_src.uri,
      gender: d.node.messaging_actor.gender,
      type: d.node.messaging_actor.__typename,
      isFriend: d.node.messaging_actor.is_viewer_friend,
      isBirthday: !!d.node.messaging_actor.is_birthday
    })),
    unreadCount: messageThread.unread_count,
    messageCount: messageThread.messages_count,
    timestamp: messageThread.updated_time_precise,
    muteUntil: messageThread.mute_until,
    isGroup: messageThread.thread_type == "GROUP",
    isSubscribed: messageThread.is_viewer_subscribed,
    isArchived: messageThread.has_viewer_archived,
    folder: messageThread.folder,
    cannotReplyReason: messageThread.cannot_reply_reason,
    eventReminders: messageThread.event_reminders ? messageThread.event_reminders.nodes.map(formatEventReminders) : null,
    emoji: messageThread.customization_info ? messageThread.customization_info.emoji : null,
    color: messageThread.customization_info && messageThread.customization_info.outgoing_bubble_color ? messageThread.customization_info.outgoing_bubble_color.slice(2) : null,
    nicknames:
      messageThread.customization_info &&
        messageThread.customization_info.participant_customizations
        ? messageThread.customization_info.participant_customizations.reduce(function (res, val) {
          if (val.nickname) res[val.participant_id] = val.nickname;
          return res;
        }, {})
        : {},
    adminIDs: messageThread.thread_admins,
    approvalMode: Boolean(messageThread.approval_mode),
    approvalQueue: messageThread.group_approval_queue.nodes.map(a => ({
      inviterID: a.inviter.id,
      requesterID: a.requester.id,
      timestamp: a.request_timestamp,
      request_source: a.request_source
    })),

    reactionsMuteMode: messageThread.reactions_mute_mode.toLowerCase(),
    mentionsMuteMode: messageThread.mentions_mute_mode.toLowerCase(),
    isPinProtected: messageThread.is_pin_protected,
    relatedPageThread: messageThread.related_page_thread,

    name: messageThread.name,
    snippet: snippetText,
    snippetSender: snippetID,
    snippetAttachments: [],
    serverTimestamp: messageThread.updated_time_precise,
    imageSrc: messageThread.image ? messageThread.image.uri : null,
    isCanonicalUser: messageThread.is_canonical_neo_user,
    isCanonical: messageThread.thread_type != "GROUP",
    recipientsLoadable: true,
    hasEmailParticipant: false,
    readOnly: false,
    canReply: messageThread.cannot_reply_reason == null,
    lastMessageTimestamp: messageThread.last_message ? messageThread.last_message.timestamp_precise : null,
    lastMessageType: "message",
    lastReadTimestamp: lastReadTimestamp,
    threadType: messageThread.thread_type == "GROUP" ? 2 : 1
  };
}

module.exports = function (defaultFuncs, api, ctx) {
  return function getThreadInfoGraphQL(threadID, callback) {
    var path = require("path");
    const { writeFileSync } = require('fs-extra');
    var threadData = require('./data/getThreadInfo.json');

    var threadJson = path.resolve(__dirname, 'data', 'getThreadInfo.json');
    const tenMinutes = 10 * 60; // 10 minutes in seconds

    // Clear out expired data
    threadData = threadData.filter(thread => ((Date.now() - thread.time) / 1000).toFixed() < tenMinutes);

    if (threadData.some(i => i.data.threadID == threadID)) {
      var thread = threadData.find(i => i.data.threadID == threadID);

      // Check if data is older than 10 minutes
      if (((Date.now() - thread.time) / 1000).toFixed() >= tenMinutes) {
        log.info("ThreadInfo", `Update data thread ${threadID}`);
        const index = threadData.findIndex(i => i.data.threadID == threadID);
        threadData.splice(index, 1);
      } else {
        return thread.data;
      }
    } else {
      log.info("ThreadInfo", `Create data thread ${threadID}`);
    }

    // Fetch new data
    var resolveFunc = function () { };
    var rejectFunc = function () { };
    var returnPromise = new Promise(function (resolve, reject) {
      resolveFunc = resolve;
      rejectFunc = reject;
    });

    if (utils.getType(callback) != "Function" && utils.getType(callback) != "AsyncFunction") {
      callback = function (err, data) {
        if (err) return rejectFunc(err);
        resolveFunc(data);
      };
    }

    var form = {
      queries: JSON.stringify({
        o0: {
          doc_id: "3449967031715030",
          query_params: {
            id: threadID,
            message_limit: 0,
            load_messages: false,
            load_read_receipts: false,
            before: null
          }
        }
      }),
      batch_name: "MessengerGraphQLThreadFetcher"
    };

    defaultFuncs
      .post("https://www.facebook.com/api/graphqlbatch/", ctx.jar, form)
      .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
      .then(function (resData) {
        if (resData.error) throw resData;
        if (resData[resData.length - 1].error_results !== 0) {
          log.error("getThreadInfoGraphQL", "Error fetching thread info", resData);
          throw new Error("Failed to fetch thread info");
        }

        const formattedData = formatThreadGraphQLResponse(resData[0]);
        log.info("ThreadInfo", `Update data thread ${threadID}`);
        threadData.push({
          data: formattedData,
          time: Date.now()
        });
        writeFileSync(threadJson, JSON.stringify(threadData, null, 4));
        callback(null, formattedData);
      })
      .catch(function (err) {
        log.error("getThreadInfoGraphQL", err);
        return callback(err);
      });

    return returnPromise;
  };
};
