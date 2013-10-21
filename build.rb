
require 'find'
require 'fileutils'

Find.find('wireit/lib/yui') { |file|

 next unless File.file?(file)
puts file
 ext = File.basename(file).partition(/\./)[2]

 srcdir = File.dirname(file)

 case ext
 when 'css'
   destdir = File.join('vendor', 'assets', 'stylesheets', 'wireit', srcdir.partition('wireit/lib/')[2])
 when 'js'
   destdir = File.join('vendor', 'assets', 'javascripts', 'wireit', srcdir.partition('wireit/lib/')[2])
 when 'png'
   destdir = File.join('vendor', 'assets', 'images', 'wireit', srcdir.partition('wireit/lib/')[2])
 else
   next
 end

# puts "cp #{file} #{destdir}"

puts "mkdir #{destdir}"

 FileUtils.mkdir_p destdir
 FileUtils.cp file, destdir
}

