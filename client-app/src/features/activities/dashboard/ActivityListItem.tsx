import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import ActivityListItemAttendee from "./ActivityListItemAttendee";
import { DateTime } from "luxon";

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
  return (
    <Segment.Group
      style={{
        width: "100%",
        maxWidth:
          window.innerWidth > 768
            ? "800px"
            : window.innerWidth > 480
            ? "95vw"
            : "98vw",
        margin: "0.5em auto",
        padding: window.innerWidth > 768 ? "0" : "0 0.5em",
      }}
    >
      <Segment style={{ padding: "clamp(12px, 3vw, 16px)" }}>
        {activity.isCancelled && (
          <Label
            attached="top"
            color="red"
            content="Cancelled"
            style={{
              textAlign: "center",
              fontSize: "clamp(12px, 3vw, 14px)",
              padding: "clamp(4px, 1vw, 8px)",
            }}
          />
        )}
        <Item.Group>
          <Item
            style={{
              flexDirection: window.innerWidth > 768 ? "row" : "column",
            }}
          >
            <Item.Image
              style={{
                marginBottom: window.innerWidth > 768 ? 3 : "1em",
                alignSelf: window.innerWidth > 768 ? "auto" : "center",
              }}
              size="tiny"
              circular
              src={activity.host?.image || `/assets/user.png`}
            />
            <Item.Content
              style={{ textAlign: window.innerWidth > 768 ? "left" : "center" }}
            >
              <Item.Header
                as={Link}
                to={`/activities/${activity.id}`}
                style={{
                  fontSize: "clamp(16px, 4vw, 18px)",
                  lineHeight: "1.3",
                  marginBottom: "0.5em",
                }}
              >
                {activity.title}
              </Item.Header>
              <Item.Description style={{ fontSize: "clamp(14px, 3vw, 15px)" }}>
                Hosted By{" "}
                <Link to={`/profiles/${activity.hostUsername}`}>
                  {" "}
                  {activity.host?.displayName}
                </Link>
              </Item.Description>
              {activity.isHost && (
                <Item.Description style={{ marginTop: "0.5em" }}>
                  <Label
                    basic
                    color="orange"
                    style={{
                      fontSize: "clamp(12px, 3vw, 14px)",
                      padding: "clamp(4px, 1vw, 8px)",
                    }}
                  >
                    You are hosting this activty
                  </Label>
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description style={{ marginTop: "0.5em" }}>
                  <Label
                    basic
                    color="green"
                    style={{
                      fontSize: "clamp(12px, 3vw, 14px)",
                      padding: "clamp(4px, 1vw, 8px)",
                    }}
                  >
                    You are going to this activty
                  </Label>
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment style={{ padding: "clamp(12px, 3vw, 16px)" }}>
        <span
          style={{
            display: "flex",
            flexDirection: window.innerWidth > 768 ? "row" : "column",
            gap: window.innerWidth > 768 ? "1em" : "0.5em",
            fontSize: "clamp(14px, 3vw, 15px)",
            textAlign: window.innerWidth > 768 ? "left" : "center",
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: window.innerWidth > 768 ? "flex-start" : "center",
            }}
          >
            <Icon name="clock" style={{ marginRight: "0.5em" }} />
            {DateTime.fromISO(activity.date?.toISOString() as string).toFormat(
              `L'/'dd'/'yyyy   h':'mma `
            )}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: window.innerWidth > 768 ? "flex-start" : "center",
            }}
          >
            <Icon name="marker" style={{ marginRight: "0.5em" }} />
            {activity.venue}
          </span>
        </span>
      </Segment>
      <Segment style={{ padding: "clamp(12px, 3vw, 16px)" }}>
        <ActivityListItemAttendee attendees={activity.attendees!} />
      </Segment>
      <Segment clearing style={{ padding: "clamp(12px, 3vw, 16px)" }}>
        <span
          style={{
            fontSize: "clamp(14px, 3vw, 15px)",
            lineHeight: "1.4",
            display: "block",
            marginBottom: "1em",
          }}
        >
          {activity.description}
        </span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          color="teal"
          content="View"
          floated={window.innerWidth > 768 ? "right" : undefined}
          style={{
            width: window.innerWidth > 768 ? "auto" : "100%",
            fontSize: "clamp(14px, 3vw, 16px)",
            padding: "clamp(8px, 2vw, 12px)",
          }}
        />
      </Segment>
    </Segment.Group>
  );
}
