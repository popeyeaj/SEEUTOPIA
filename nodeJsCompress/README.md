<h1>Bored Robot</h1>
<p>A kindly worker that based on nodejs and uglify-js module, automatically detecting and compiling javascript files within the period of development</p>

<h2>Caution</h2>
<p style="color:red">Do not put any JS core into the 'lib' folder.</p>

<h2>Instrument</h2>
<ol>
  <li>Install 
      <a href="http://nodejs.org" target="_blank">Node.Js</a> and 
      <a href="https://github.com/mishoo/UglifyJS2" target="_blank">Uglify2</a></li>
  <li>Put the package in your project.</li>
  <li>Bring script files you need compile in the called 'lib' folder </li>
  <li>Edit the '_jsfiles.list' file, and insert script files-name to it in sequence.</li>
  <li>Double click 'compress.bat' in the root path</li>
  <li>Have fun!  ~~~hia hia hia~~~</li>
</ol>


<h2>教程</h2>
<ol>
	<li>
		<strong>安装</strong>
		<ol>
			<li>
				<a href="http://nodejs.org" target="_blank">Node.Js</a><br>
				<strong>安装方式：</strong>下载nodejs安装包，双击进行安装。
			</li>
			<li>
				<a href="https://github.com/mishoo/UglifyJS2" target="_blank">Uglify2</a><br>
				<strong>安装方式：</strong>安装完nodejs打开命令行工具，键入npm install uglify-js即可安装。
			</li>
		</ol>
	</li>
	<li>
		<strong>配置config.json文件：</strong><br>
		设置需要监控的js目录，带压缩的js文件，以及压缩后保存的路径。
	</li>
	<li>双击compress.bat即可自动压缩。或者打开命令行工具进入本工具根目录键入node build即可。</li>
</ol>