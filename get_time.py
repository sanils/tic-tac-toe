import time
import os

def testCommand(cmd):
	totalTime = 0.0
	for i in range(0, 5):
		startTime = time.time()
		os.system(cmd)
		totalTime += (time.time() - startTime)
	print("Average time for: %s is %f seconds" % (cmd, totalTime/5.0))

testCommand('npm run test_jest')
testCommand('npm run test_jasmine')
testCommand('npm run test_mocha')
