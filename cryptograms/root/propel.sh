#!/bin/sh

vendor/propel/generator/bin/propel-gen . reverse
vendor/propel/generator/bin/propel-gen om
vendor/propel/generator/bin/propel-gen convert-conf
