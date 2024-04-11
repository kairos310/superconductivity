import sys, math, random
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation

LENGTH = 100
TIME = 10
T = 1
mu = 1
dx = 1
dt = 1

fig, axs = plt.subplots(1)

sys.setrecursionlimit(10**9)

def gaus(x, sigma, mu):
    return 1 / np.sqrt(2 * np.pi * sigma) * np.exp(-(x - mu) ** 2  / 2 * sigma ** 2)

yarr = np.zeros((LENGTH, TIME))
yarr[:, 0] = [gaus(x,3,0) for x in range(LENGTH)]
yarr[0,0] = 2

#i is distance along the wire
#n is timestep



def y(i, n):
    if n >= TIME - 1:
        return
    x = i * dx 
    t = n * dt
    c = np.sqrt(T / mu)
    r = c * dt/ dx
    for i in range(LENGTH):
        left = 0 if i - 1 < 0 else i - 1
        right = LENGTH - 1 if i + 1>= LENGTH else i + 1
        yarr[i, n] = 2*(1 - r**2) * yarr[i, n - 1] - yarr[i, n - 2]+ r**2 * yarr[right,n - 1] + yarr[left, n -1]
    print(yarr)
    y(i, n + 1)
    
    #if math.isnan(yarr[i, n]):
        #yarr[i, n] = 2*(1 - r**2) * y(i, n - 1) - y(i, n - 2)+ r**2 * y(i + 1,n - 1) + y(i - 1, n -1)

y(0,1)


def update_lines(num, lines):
    for i, line in enumerate(lines):
        # NOTE: there is no .set_data() for 3 dim data...
        line.set_data(y(i, num))
    return lines

ani = animation.FuncAnimation(fig, update_lines, TIME, fargs=(yarr), interval=100)

plt.show()

# fig = plt.figure()
# i=0
# im = plt.plot(yarr[0], animated=True)
# def updatefig(*args):
#     global i
#     if (i<99):
#         i += 1
#     else:
#         i=0
#     im.set_array(yarr[i])
#     return im,
# ani = animation.FuncAnimation(fig, updatefig,  blit=True)
# plt.show()
