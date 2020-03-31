require "json"

Pod::Spec.new do |s|
  s.name         = "ToastHybrid"
  s.version      = "1.0"
  s.summary      = "Native HUD"
 
  s.homepage     = "https://github.com/listenzz/react-native-toast-hybrid"
  s.license      = "MIT"
  s.authors      = { "listen" => "listenzz@163.com" }
  s.platforms    = { :ios => "9.0", :tvos => "10.0" }
  s.source       = { :git => "https://github.com/listenzz/react-native-toast-hybrid.git", :tag => "#{s.version}" }

  s.source_files = "ToastHybrid/**/*.{h,m,swift}"
  s.resource_bundles = {
    'ToastHybrid' => ['ToastHybrid/*.{storyboard,xib,xcassets,json,imageset,png}']
  }
  s.dependency "React"
  s.frameworks   = "CoreGraphics", "QuartzCore"
end