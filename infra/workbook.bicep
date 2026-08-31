param name string
param location string
param tags object
param sourceId string

var workbookData = {
  version: 'Notebook/1.0'
  items: [
    {
      type: 1
      content: {
        json: '# Legendary Women analytics\nTraffic, engagement, favorites, and browser health from Application Insights.'
      }
      name: 'workbook-title'
    }
    {
      type: 9
      content: {
        version: 'KqlParameterItem/1.0'
        parameters: [
          {
            id: 'b64ae428-5651-4fa0-a991-3b27b4f5ac7f'
            version: 'KqlParameterItem/1.0'
            name: 'TimeRange'
            label: 'Time range'
            type: 4
            isRequired: true
            value: {
              durationMs: 2592000000
            }
            typeSettings: {
              selectableValues: [
                {
                  durationMs: 86400000
                  displayName: 'Last 24 hours'
                }
                {
                  durationMs: 604800000
                  displayName: 'Last 7 days'
                }
                {
                  durationMs: 2592000000
                  displayName: 'Last 30 days'
                }
                {
                  durationMs: 7776000000
                  displayName: 'Last 90 days'
                }
              ]
              allowCustom: true
            }
          }
        ]
        style: 'pills'
        queryType: 0
        resourceType: 'microsoft.insights/components'
      }
      name: 'time-range'
    }
    {
      type: 3
      content: {
        version: 'KqlItem/1.0'
        query: '''
let pageViewCount = toscalar(pageViews | where timestamp {TimeRange} | summarize count());
let userCount = toscalar(pageViews | where timestamp {TimeRange} | summarize dcount(user_Id));
let sessionCount = toscalar(pageViews | where timestamp {TimeRange} | summarize dcount(session_Id));
let favoriteAdds = toscalar(customEvents | where timestamp {TimeRange} and name == "favorite_added" | summarize count());
let favoriteRemoves = toscalar(customEvents | where timestamp {TimeRange} and name == "favorite_removed" | summarize count());
union
  (print Metric="Page views", Value=pageViewCount),
  (print Metric="Approximate users", Value=userCount),
  (print Metric="Sessions", Value=sessionCount),
  (print Metric="Favorites added", Value=favoriteAdds),
  (print Metric="Favorites removed", Value=favoriteRemoves)
'''
        size: 0
        title: 'Summary'
        queryType: 0
        resourceType: 'microsoft.insights/components'
        visualization: 'tiles'
      }
      name: 'summary-tiles'
    }
    {
      type: 3
      content: {
        version: 'KqlItem/1.0'
        query: '''
pageViews
| where timestamp {TimeRange}
| summarize PageViews=count(), ['Daily active users']=dcount(user_Id) by bin(timestamp, 1d)
| order by timestamp asc
'''
        size: 0
        title: 'Daily traffic'
        queryType: 0
        resourceType: 'microsoft.insights/components'
        visualization: 'timechart'
      }
      name: 'daily-traffic'
    }
    {
      type: 3
      content: {
        version: 'KqlItem/1.0'
        query: '''
pageViews
| where timestamp {TimeRange}
| summarize Views=count(), ApproximateUsers=dcount(user_Id) by Page=name, URL=url
| top 20 by Views desc
'''
        size: 0
        title: 'Popular pages'
        queryType: 0
        resourceType: 'microsoft.insights/components'
        visualization: 'table'
      }
      name: 'popular-pages'
    }
    {
      type: 3
      content: {
        version: 'KqlItem/1.0'
        query: '''
customEvents
| where timestamp {TimeRange} and name == "favorite_added"
| summarize Favorites=count(), ApproximateUsers=dcount(user_Id) by Woman=tostring(customDimensions.woman_slug)
| top 20 by Favorites desc
'''
        size: 0
        title: 'Most-favorited women'
        queryType: 0
        resourceType: 'microsoft.insights/components'
        visualization: 'barchart'
      }
      name: 'favorite-ranking'
    }
    {
      type: 3
      content: {
        version: 'KqlItem/1.0'
        query: '''
customEvents
| where timestamp {TimeRange} and name in ("favorite_added", "favorite_removed")
| summarize Added=countif(name == "favorite_added"), Removed=countif(name == "favorite_removed") by bin(timestamp, 1d)
| order by timestamp asc
'''
        size: 0
        title: 'Favorite activity'
        queryType: 0
        resourceType: 'microsoft.insights/components'
        visualization: 'timechart'
      }
      name: 'favorite-activity'
    }
    {
      type: 3
      content: {
        version: 'KqlItem/1.0'
        query: '''
exceptions
| where timestamp {TimeRange}
| summarize Occurrences=count(), LastSeen=max(timestamp) by Type=type, Message=outerMessage
| top 20 by Occurrences desc
'''
        size: 0
        title: 'Recent client errors'
        queryType: 0
        resourceType: 'microsoft.insights/components'
        visualization: 'table'
      }
      name: 'client-errors'
    }
  ]
  isLocked: false
  fallbackResourceIds: [
    sourceId
  ]
}

resource workbook 'Microsoft.Insights/workbooks@2023-06-01' = {
  name: name
  location: location
  kind: 'shared'
  tags: tags
  properties: {
    category: 'workbook'
    description: 'Traffic, usage, favorites, and client-health analytics for Legendary Women.'
    displayName: 'Legendary Women Analytics'
    serializedData: string(workbookData)
    sourceId: sourceId
    version: 'Notebook/1.0'
  }
}

output id string = workbook.id
