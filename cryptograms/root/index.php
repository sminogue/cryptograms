<html>
<head>
<link rel="stylesheet/less" type="text/css" href="css/cryptograms.less">
<script src="js/less-1.3.0.min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.1/jquery.min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.0.0.beta6/handlebars.min.js" type="text/javascript"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/ember.js/1.0.pre/ember-1.0.pre.min.js" type="text/javascript"></script>
<script src="js/cryptogram.js" type="text/javascript"></script>

</head>
<body>

<script id="template" type="text/handlebars">
<table class="puzzle">
<tr class="puzzleRow">
{{#ciphertext}}
<td class="puzzleCell">
{{#if symbol}}<input class="letterbox sym{{symbol}}" symbol="{{symbol}}" type="text" size="1" maxlength="1"/>{{/if}}
<div class="cipherLetter">{{symbol}}</div>
</td>
{{/ciphertext}}
</tr>
</table>
</script>

<div class="puzzleFrame">
</div>	

</body>
</html>
