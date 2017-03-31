# Read more about app structure at http://docs.appgyver.com

module.exports =

  # See styling options for tabs and other native components in app/common/native-styles/ios.css or app/common/native-styles/android.css

  rootView:
    location: "profile#index"

  preloads: [
    {
      id: "potty"
      location: "profile#potty"
    }
  #  {
  #    id: "using-the-scanner"
  #    location: "example#using-the-scanner"
  #  }
  ]

  # drawers:
  #   left:
  #     id: "leftDrawer"
  #     location: "example#drawer"
  #     showOnAppLoad: false
  #   options:
  #     animation: "swingingDoor"
  #
  initialView:
    id: "new"
    location: "profile#new-profile"
