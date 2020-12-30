# unmangleOutlookSafelinks [Install here](https://addons.thunderbird.net/en-US/thunderbird/addon/unmangle-outlook-safelinks/)

Thunderbird plugin to unmangle Outlook Protection Safelinks

Based upon https://github.com/mbattersby/unmangleOutlookSafelinks
Original version by mib@post.com

Users of Office365 who have Advanced Thread Protection enabled will change
all URL's in emails to redirect them to an Microsoft filter before opening.
This will leak information to Microsoft and makes it impossible to see if
the original URL was safe to open.

E.g. a link to http://phishingsite.fake.ru/you/are/hacked.php will show as
https://emea01.safelinks.protection.outlook.com/?url=http%3A%2F%2Fphishingsite.fake.ru%2Fyou%2Fare%2Fhacked.phpdata=02%7C01%7Csender.mail%40domain.tld%7C8177af7905a4406ecae208d5dc1fb7c9%7C87c50b582ef2423da4dbaedde7c84efcfa%7C0%7C0%7C63453351150545403&sdata=Te0O1xGxxxULxdzbxQ%2xxxyql2QjTt4Ken%2F00JB%2BV%2FPUA%3D&reserved=0

and will not be recognized by a user as dangerous.

This also inherently introduces the ability to do:
* Man-in-the-middle
* Tracking of user clicks
* Possibly a lot of (unnecessary) redirects
* Lack of readability.

This plugin will change the URL back to the original value.

Version 1.* is compatible with Thunderbird 60.*

Version 2.* is compatible with Thunderbird 68+

Version 3.* is compatible with Thunderbird 78+

